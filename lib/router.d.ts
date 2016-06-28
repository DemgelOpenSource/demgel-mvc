/// <reference types="lodash" />
/// <reference types="express" />
import { interfaces as i } from "inversify";
import { RequestHandler, Router } from "express";
export declare class RouteBuilder {
    kernel: i.Kernel;
    routes: Map<Function, ContainerRoute>;
    constructor();
    registerController(path: string, target: any): void;
    registerHandler(httpMethod: string, path: string, target: any, targetMethod: string, parameters: string): void;
    registerClassMiddleware(target: any, middleware: RequestHandler): void;
    registerMethodMiddleware(target: any, propertyKey: string, middleware: RequestHandler): void;
    getRoute(controller: any): ContainerRoute | undefined;
    build(): IterableIterator<ContainerRoute>;
    newController(): ContainerRoute;
    newControllerMethod(): ControllerMethod;
    sortMiddleware(middleware: Map<Priority, RequestHandler[]>): Array<RequestHandler>;
    pushMiddleware(priority: Priority, middleware: Map<Priority, RequestHandler[]>, middlewareArray: RequestHandler[]): void;
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
export declare enum Priority {
    Authorize = 0,
    Pre = 1,
    Post = 2,
    Normal = 3,
}
export interface RouteBuilder {
}
