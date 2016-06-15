import {RouteBuilder} from "../router";
import {RequestHandler} from "express";

export function Controller(path: string) {
    return target => {
        RouteBuilder.instance.registerController(path, target);
    }
}

export function logger() {
    return target => {
        RouteBuilder.instance.registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        });
    }
}

export function methodLogger() {
    return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
        RouteBuilder.instance.registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        })
    }
}
