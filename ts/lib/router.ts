import {interfaces as i, injectable} from "inversify";
import {mvcController} from "./controllers/mvcController";
import {AllowedMethods} from "./express-mvc";
import {Request, Response, RequestHandler, Router, IRouterMatcher} from "express";
import {Result} from "./result/result";
import {ErrorResult} from "./result/error";
import {Context} from "./context";
import {clone} from "lodash";
import * as _debug from "debug";

const debug = _debug("expressify:router");

@injectable()
export class RouteBuilder {
    kernelInstance: i.Kernel;
    routes: Map<Function, IContainerRoute> = new Map<Function, IContainerRoute>();

    constructor() {
    }
    
    registerController(path: string, target: any) {
        debug("registering controller", target.name);
        if (!this.routes.has(target)) {
            debug("setting container");
            this.routes.set(target, this.newController());
        }

        let container = this.routes.get(target);
        container.path = path;
    }

    registerHandler(httpMethod: AllowedMethods, path: string, target: any, targetMethod: string, parameters: string) {
        debug("registering handler", targetMethod);
        if (!this.routes.has(target.constructor)) {
            debug("setting container", target);
            this.routes.set(target.constructor, this.newController());
        }

        let container = this.routes.get(target.constructor);

        if (!container.methods.has(targetMethod)) {
            container.methods.set(targetMethod, this.newControllerMethod());
        }

        let method = container.methods.get(targetMethod);
        method.method = httpMethod;
        method.path = path;
        method.parameters = parameters;
    }

    registerClassMiddleware(target: any, middleware: RequestHandler, priority: Priority = Priority.Normal) {
        debug("registering class middleware", target.name)
        if (!this.routes.has(target)) {
            debug("setting container", target.name);
            this.routes.set(target, this.newController());
        }

        let container = this.routes.get(target);
        
        if (!container.middleware.has(priority)) {
            container.middleware.set(priority, []);
        }

        container.middleware.get(priority).push(middleware);
    }

    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler, priority: Priority = Priority.Normal) {
        if (!this.routes.has(target.constructor)) {
            this.routes.set(target.constructor, this.newController());
        }

        let container = this.routes.get(target.constructor);

        if (!container.methods.get(propertyKey)) {
            container.methods.set(propertyKey, this.newControllerMethod());
        }

        let method = container.methods.get(propertyKey);

        if (!method.middleware.has(priority)) {
            method.middleware.set(priority, []);
        }

        method.middleware.get(priority).push(middleware);

    }

    getRoute(controller: any): IContainerRoute {
        return this.routes.get(controller);
    }   
    
    build(): IterableIterator<IContainerRoute> {
        // First we get all controllers
        this.routes.forEach((route, idx) => {
            // We will need to apply the method routes to the router of each controller
            route.methods.forEach((method, targetMethod) => {
                let registerHandlerOnRouter = <IRouterMatcher<Router>>route.router[AllowedMethods[method.method].toLowerCase()];
                let handler = (req: Request, res: Response, next: any) => {
                    let cont: mvcController = this.kernelInstance.get(<any>idx) as mvcController;
                    cont.context = (<any>req).context || new Context(req, res);

                    let args: Array<any> = [];
                    let methodParams: Array<any> = Reflect.getMetadata("design:paramtypes", cont, targetMethod);
                    debug("method parameters", methodParams);
                    Object.keys(req.params).forEach((param) => {
                        args.push(req.params[param]);
                    });
                    let result: Result = cont[targetMethod].apply(cont, args);
                    result.handle(res);
                };

                let mw = this.sortMiddleware(method.middleware);
                
                registerHandlerOnRouter.apply(route.router, [method.path + method.parameters, ...mw, handler]);
            });
        });
        
        return this.routes.values();
    }

    newController(): IContainerRoute {
        return {
            middleware: new Map<Priority, RequestHandler[]>(),
            path: undefined,
            router: Router(),
            methods: new Map<string, IControllerMethod>()
        }
    }

    newControllerMethod(): IControllerMethod {
        return {
            middleware: new Map < Priority, RequestHandler[]>(),
            path: undefined,
            method: undefined,
            parameters: ""
        }
    }

    sortMiddleware(middleware: Map<Priority, RequestHandler[]>) {
        let mw = [];
        if (middleware.has(Priority.Authorize)) {
            mw.push(middleware.get(Priority.Authorize));
        }
        if (middleware.has(Priority.Pre)) {
            mw.push(middleware.get(Priority.Pre));
        }
        if (middleware.has(Priority.Normal)) {
            mw.push(middleware.get(Priority.Normal));
        }
        if (middleware.has(Priority.Post)) {
            mw.push(middleware.get(Priority.Post));
        }
        return mw;
    }
}

export interface IContainerRoute {
    middleware: Map<Priority, RequestHandler[]>;
    methods: Map<string, IControllerMethod>; 
    path: string;
    router: Router;
}

export interface IControllerMethod {
    middleware: Map<Priority, RequestHandler[]>;
    path: string;
    method: AllowedMethods;
    parameters: string;
}

export enum Priority {
    Authorize,
    Pre,
    Post,
    Normal
}

export interface IRouteBuilder {
    kernel: i.Kernel;
    getRoute(controller: any | string): IContainerRoute;
    registerHandler(httpMethod: AllowedMethods, path: string, target: any, targetMethod: string, parameters: string): void;
    registerController(path: string, target: any): void;
    registerClassMiddleware(target: any, middleware: RequestHandler, priority?: Priority): void;
    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler, priority?: Priority): void;
    build(): IterableIterator<IContainerRoute>;
}