import {RouteBuilder} from "../router";
import {RequestHandler} from "express";
import {kernel, getRouter} from "../setup";

export function Controller(path: string) {
    return target => {
        getRouter().registerController(path, target);
    }
}

export function logger() {
    return target => {
        getRouter().registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        });
    }
}

export function methodLogger() {
    return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
        getRouter().registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        })
    }
}
