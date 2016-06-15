"use strict";
const express_mvc_1 = require("./express-mvc");
const express_1 = require("express");
const context_1 = require("./context");
const _debug = require("debug");
require("reflect-metadata");
const debug = _debug("router");
class RouteBuilder {
    constructor() {
        this.routes = new Map();
    }
    set kernel(value) {
        this.kernelInstance = value;
    }
    static get instance() {
        if (!this.routeInstance) {
            this.routeInstance = new RouteBuilder();
        }
        return this.routeInstance;
    }
    registerController(path, target) {
        debug("registering controller", target.name);
        if (!this.routes.has(target)) {
            this.routes.set(target, this.newController());
        }
        let container = this.routes.get(target);
        container.path = path;
    }
    registerHandler(httpMethod, path, target, targetMethod, parameters) {
        debug("registering handler", targetMethod);
        if (!this.routes.has(target.constructor)) {
            debug("setting container");
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
    registerClassMiddleware(target, middleware, priority = Priority.Normal) {
        if (!this.routes.has(target)) {
            this.routes.set(target, this.newController());
        }
        let container = this.routes.get(target);
        if (!container.middleware.has(priority)) {
            container.middleware.set(priority, []);
        }
        container.middleware.get(priority).push(middleware);
    }
    registerMethodMiddleware(target, propertyKey, middleware, priority = Priority.Normal) {
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
    getRoute(controller) {
        return this.routes.get(controller);
    }
    build() {
        // First we get all controllers
        this.routes.forEach((route, idx) => {
            // We will need to apply the method routes to the router of each controller
            route.methods.forEach((method, targetMethod) => {
                let registerHandlerOnRouter = route.router[express_mvc_1.AllowedMethods[method.method].toLowerCase()];
                let handler = (req, res, next) => {
                    let cont = this.kernelInstance.get(idx);
                    cont.context = req.context || new context_1.Context(req, res);
                    let args = [];
                    let methodParams = Reflect.getMetadata("design:paramtypes", cont, targetMethod);
                    debug("method parameters", methodParams);
                    Object.keys(req.params).forEach((param) => {
                        args.push(req.params[param]);
                    });
                    let result = cont[targetMethod].apply(cont, args);
                    result.handle(res);
                };
                let mw = [];
                method.middleware.forEach(middleware => {
                    mw.push(middleware);
                });
                registerHandlerOnRouter.apply(route.router, [method.path + method.parameters, ...mw, handler]);
            });
        });
        return this.routes.values();
    }
    newController() {
        return {
            middleware: new Map(),
            path: undefined,
            router: express_1.Router(),
            methods: new Map()
        };
    }
    newControllerMethod() {
        return {
            middleware: new Map(),
            path: undefined,
            method: undefined,
            parameters: ""
        };
    }
}
exports.RouteBuilder = RouteBuilder;
(function (Priority) {
    Priority[Priority["Authorize"] = 0] = "Authorize";
    Priority[Priority["Pre"] = 1] = "Pre";
    Priority[Priority["Post"] = 2] = "Post";
    Priority[Priority["Normal"] = 3] = "Normal";
})(exports.Priority || (exports.Priority = {}));
var Priority = exports.Priority;
