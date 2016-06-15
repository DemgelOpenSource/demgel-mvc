"use strict";
const router_1 = require("../router");
function Controller(path) {
    return target => {
        router_1.RouteBuilder.instance.registerController(path, target);
    };
}
exports.Controller = Controller;
function logger() {
    return target => {
        router_1.RouteBuilder.instance.registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        });
    };
}
exports.logger = logger;
function methodLogger() {
    return (target, propertyKey, descriptor) => {
        router_1.RouteBuilder.instance.registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        });
    };
}
exports.methodLogger = methodLogger;
