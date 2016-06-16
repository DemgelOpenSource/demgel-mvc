import {RouteBuilder} from "../router";
import {RequestHandler} from "express";
import {kernel} from "../setup";

export function Controller(path: string) {
    return target => {
        kernel.get<RouteBuilder>(RouteBuilder).registerController(path, target);
        // RouteBuilder.instance.registerController(path, target);
    }
}

export function logger() {
    return target => {
        kernel.get<RouteBuilder>(RouteBuilder).registerClassMiddleware(target, (res, req, next) => {   
        // RouteBuilder.instance.registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        });
    }
}

export function methodLogger() {
    return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
        kernel.get<RouteBuilder>(RouteBuilder).registerMethodMiddleware(target, propertyKey, (res, req, next) => {
        // RouteBuilder.instance.registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        })
    }
}
