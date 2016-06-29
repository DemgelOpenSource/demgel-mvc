import {interfaces as i, injectable} from "inversify";
import {mvcController} from "./controllers/mvcController";
import {AllowedMethods} from "./express-mvc";
import {Request, Response, RequestHandler, Router, IRouterMatcher} from "express";
import {Result} from "./result/result";
import {ErrorResult} from "./result/error";
import {Context} from "./context";
import {clone} from "lodash";
import * as _debug from "debug";

const debug = _debug("demgel-mvc:router");

@injectable()
export class RouteBuilder {
    kernel: i.Kernel;
    routes: Map<Function, ContainerRoute> = new Map<Function, ContainerRoute>();

    constructor() {
    }
    
    registerController(path: string, target: any) {
        debug("registering controller", target.name);

        let container = this.routes.get(target);
        if (!container) {
            container = this.newController();
            this.routes.set(target, container);
        }
        if (container) {
            container.path = path;
        }    
    }
    
    registerHandler(httpMethod: string, path: string, target: any, targetMethod: string, parameters: string) {
        debug("registering handler", targetMethod);

        let container = this.routes.get(target.constructor);

        if (!container) {
            container = this.newController();
            this.routes.set(target.constructor, container);
        }

        let method = container.methods.get(targetMethod);
        if (!method) {
            method = this.newControllerMethod();
            container.methods.set(targetMethod, method);
        }
        method.method = httpMethod;
        method.path = path;
        method.parameters = parameters;
    }

    registerClassMiddleware(target: any, middleware: RequestHandler): void;    
    registerClassMiddleware(target: any, middleware: RequestHandler, priority: Priority = Priority.Normal): void {
        debug("registering class middleware", target.name)

        let container = this.routes.get(target);
        
        if (!container) {
            container = this.newController();
            this.routes.set(target, container);
        }

        let mw = container.middleware.get(priority);     
        if (!mw) {
            mw = [];
            container.middleware.set(priority, mw);
        }

        mw.push(middleware);
    }

    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler): void;    
    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler, priority: Priority = Priority.Normal): void {
        let container = this.routes.get(target.constructor);
        if (!container) {
            container = this.newController();
            this.routes.set(target.constructor, container);
        }

        let method = container.methods.get(propertyKey);
        if (!method) {
            method = this.newControllerMethod();
            container.methods.set(propertyKey, method);
        }

        let priorityMiddleware = method.middleware.get(priority);        
        if (!priorityMiddleware) {
            priorityMiddleware = [];
            method.middleware.set(priority, priorityMiddleware);
        }

        priorityMiddleware.push(middleware);
    }

    getRoute(controller: any): ContainerRoute | undefined {
        return this.routes.get(controller);
    }   
    
    build(): IterableIterator<ContainerRoute> {
        // First we get all controllers
        this.routes.forEach((route, idx) => {
            // We will need to apply the method routes to the router of each controller
            route.methods.forEach((method, targetMethod) => {
                // If somehow method is not set, don't apply it
                if (method.method) {
                    let registerHandlerOnRouter = <IRouterMatcher<Router>>(<any>route.router)[method.method.toLowerCase()];
                    let handler = (req: Request, res: Response, next: any) => {
                        debug("retrieving controller");
                        let cont: mvcController = this.kernel.get(<any>idx) as mvcController;
                        cont.context = (<any>req).context || new Context(req, res);

                        let args: Array<any> = [];
                        let methodParams: Array<any> = Reflect.getMetadata("design:paramtypes", cont, targetMethod);
                        debug("method parameters", methodParams);
                        Object.keys(req.params).forEach((param) => {
                            args.push(req.params[param]);
                        });
                        let result: Result = (<any>cont)[targetMethod].apply(cont, args);
                        debug("checking if headers are sent", res.headersSent);
                        if (!res.headersSent) {
                            result.handle(res);
                        }
                    };

                    let mw = this.sortMiddleware(method.middleware);
                
                    registerHandlerOnRouter.apply(route.router, [method.path + method.parameters, ...mw, handler]);
                }
            });
        });
        
        return this.routes.values();
    }

    newController(): ContainerRoute {
        return {
            middleware: new Map<Priority, RequestHandler[]>(),
            path: undefined,
            router: Router(),
            methods: new Map<string, ControllerMethod>()
        }
    }

    newControllerMethod(): ControllerMethod {
        return {
            middleware: new Map < Priority, RequestHandler[]>(),
            path: undefined,
            method: undefined,
            parameters: ""
        }
    }

    sortMiddleware(middleware: Map<Priority, RequestHandler[]>): Array<RequestHandler> {
        let mw: Array<RequestHandler> = [];

        this.pushMiddleware(Priority.Authorize, middleware, mw);
        this.pushMiddleware(Priority.Pre, middleware, mw);
        this.pushMiddleware(Priority.Normal, middleware, mw);
        this.pushMiddleware(Priority.Post, middleware, mw);

        return mw;
    }

    pushMiddleware(priority: Priority, middleware: Map<Priority, RequestHandler[]>, middlewareArray: RequestHandler[]): void {
        let mw = middleware.get(priority);
        if (mw) {
            middlewareArray.push(...mw);
        }
    }
}

export interface ContainerRoute {
    middleware: Map<Priority, RequestHandler[]>;
    methods: Map<string, ControllerMethod>; 
    path: string | undefined;
    router: Router;
}

export interface ControllerMethod {
    middleware: Map<Priority, RequestHandler[]>;
    path: string | undefined;
    method: string | undefined;
    parameters: string;
}

export enum Priority {
    Authorize,
    Pre,
    Post,
    Normal
}

export interface RouteBuilder {
}