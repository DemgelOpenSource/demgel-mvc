import { IKernel } from "inversify";
import { AllowedMethods } from "./express-mvc";
import { Request, Response, RequestHandler, Router } from "express";
import "reflect-metadata";
export declare class RouteBuilder implements IRouteBuilder {
    private static routeInstance;
    private kernelInstance;
    private routes;
    constructor();
    kernel: IKernel;
    static instance: IRouteBuilder;
    doRoute(target: any, method: string, req: Request, res: Response): void;
    registerController(path: string, target: any): void;
    registerHandler(httpMethod: AllowedMethods, path: string, target: any, targetMethod: string): void;
    registerClassMiddleware(target: any, middleware: RequestHandler, priority?: Priority): void;
    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler, priority?: Priority): void;
    build(): IterableIterator<IContainerRoute>;
    private newController();
    private newControllerMethod();
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
}
export declare enum Priority {
    Authorize = 0,
    Pre = 1,
    Post = 2,
    Normal = 3,
}
export interface IRouteBuilder {
    kernel: IKernel;
    registerHandler(httpMethod: AllowedMethods, path: string, target: any, targetMethod: string): void;
    registerController(path: string, target: any): void;
    registerClassMiddleware(target: any, middleware: RequestHandler, priority?: Priority): void;
    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler, priority?: Priority): void;
    build(): IterableIterator<IContainerRoute>;
}
