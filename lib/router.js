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
const express_mvc_1 = require("./express-mvc");
const express_1 = require("express");
const context_1 = require("./context");
const _debug = require("debug");
require("reflect-metadata");
const debug = _debug("expressify:router");
let RouteBuilder = class RouteBuilder {
    constructor() {
        this.routes = new Map();
    }
    registerController(path, target) {
        debug("registering controller", target.name);
        if (!this.routes.has(target)) {
            debug("setting container");
            this.routes.set(target, this.newController());
        }
        let container = this.routes.get(target);
        container.path = path;
    }
    registerHandler(httpMethod, path, target, targetMethod, parameters) {
        debug("registering handler", targetMethod);
        if (!this.routes.has(target.constructor)) {
            debug("setting container", target);
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
        debug("registering class middleware", target);
        if (!this.routes.has(target)) {
            debug("setting container", target);
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
                let mw = this.sortMiddleware(method.middleware);
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
    sortMiddleware(middleware) {
        let mw = [];
        if (middleware.has(Priority.Authorize)) {
            mw.push(middleware.get(Priority.Authorize));
        }
        if (middleware.has(Priority.Pre)) {
            mw.push(middleware.get(Priority.Pre));
        }
        if (middleware.has(Priority.Normal)) {
            mw.push(middleware.get(Priority.Normal));
        }
        if (middleware.has(Priority.Post)) {
            mw.push(middleware.get(Priority.Post));
        }
        return mw;
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
