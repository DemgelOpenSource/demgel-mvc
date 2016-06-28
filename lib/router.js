"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const inversify_1 = require("inversify");
const express_1 = require("express");
const context_1 = require("./context");
const _debug = require("debug");
const debug = _debug("expressify:router");
let RouteBuilder = class RouteBuilder {
    constructor() {
        this.routes = new Map();
    }
    registerController(path, target) {
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
    registerHandler(httpMethod, path, target, targetMethod, parameters) {
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
    registerClassMiddleware(target, middleware, priority = Priority.Normal) {
        debug("registering class middleware", target.name);
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
    registerMethodMiddleware(target, propertyKey, middleware, priority = Priority.Normal) {
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
    getRoute(controller) {
        return this.routes.get(controller);
    }
    build() {
        // First we get all controllers
        this.routes.forEach((route, idx) => {
            // We will need to apply the method routes to the router of each controller
            route.methods.forEach((method, targetMethod) => {
                // If somehow method is not set, don't apply it
                if (method.method) {
                    let registerHandlerOnRouter = route.router[method.method.toLowerCase()];
                    let handler = (req, res, next) => {
                        let cont = this.kernel.get(idx);
                        cont.context = req.context || new context_1.Context(req, res);
                        let args = [];
                        let methodParams = Reflect.getMetadata("design:paramtypes", cont, targetMethod);
                        debug("method parameters", methodParams);
                        Object.keys(req.params).forEach((param) => {
                            args.push(req.params[param]);
                        });
                        let result = cont[targetMethod].apply(cont, args);
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
    sortMiddleware(middleware) {
        let mw = [];
        this.pushMiddleware(Priority.Authorize, middleware, mw);
        this.pushMiddleware(Priority.Pre, middleware, mw);
        this.pushMiddleware(Priority.Normal, middleware, mw);
        this.pushMiddleware(Priority.Post, middleware, mw);
        return mw;
    }
    pushMiddleware(priority, middleware, middlewareArray) {
        let mw = middleware.get(priority);
        if (mw) {
            middlewareArray.push(...mw);
        }
    }
};
RouteBuilder = __decorate([
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [])
], RouteBuilder);
exports.RouteBuilder = RouteBuilder;
(function (Priority) {
    Priority[Priority["Authorize"] = 0] = "Authorize";
    Priority[Priority["Pre"] = 1] = "Pre";
    Priority[Priority["Post"] = 2] = "Post";
    Priority[Priority["Normal"] = 3] = "Normal";
})(exports.Priority || (exports.Priority = {}));
var Priority = exports.Priority;
