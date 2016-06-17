import { IKernel } from "inversify";
import { AllowedMethods } from "./express-mvc";
import { RequestHandler, Router } from "express";
import "reflect-metadata";
export declare class RouteBuilder {
    kernelInstance: IKernel;
    routes: Map<Function, IContainerRoute>;
    constructor();
    registerController(path: string, target: any): void;
    registerHandler(httpMethod: AllowedMethods, path: string, target: any, targetMethod: string, parameters: string): void;
    registerClassMiddleware(target: any, middleware: RequestHandler, priority?: Priority): void;
    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler, priority?: Priority): void;
    getRoute(controller: any): IContainerRoute;
    build(): IterableIterator<IContainerRoute>;
    private newController();
    private newControllerMethod();
    sortMiddleware(middleware: Map<Priority, RequestHandler[]>): any[];
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
export declare enum Priority {
    Authorize = 0,
    Pre = 1,
    Post = 2,
    Normal = 3,
}
export interface IRouteBuilder {
    kernel: IKernel;
    getRoute(controller: any | string): IContainerRoute;
    registerHandler(httpMethod: AllowedMethods, path: string, target: any, targetMethod: string, parameters: string): void;
    registerController(path: string, target: any): void;
    registerClassMiddleware(target: any, middleware: RequestHandler, priority?: Priority): void;
    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler, priority?: Priority): void;
    build(): IterableIterator<IContainerRoute>;
}
