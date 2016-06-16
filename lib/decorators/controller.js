"use strict";
const router_1 = require("../router");
const setup_1 = require("../setup");
function Controller(path) {
    return target => {
        setup_1.kernel.get(router_1.RouteBuilder).registerController(path, target);
        // RouteBuilder.instance.registerController(path, target);
    };
}
exports.Controller = Controller;
function logger() {
    return target => {
        setup_1.kernel.get(router_1.RouteBuilder).registerClassMiddleware(target, (res, req, next) => {
            // RouteBuilder.instance.registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        });
    };
}
exports.logger = logger;
function methodLogger() {
    return (target, propertyKey, descriptor) => {
        setup_1.kernel.get(router_1.RouteBuilder).registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            // RouteBuilder.instance.registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        });
    };
}
exports.methodLogger = methodLogger;
