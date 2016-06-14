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
const context_1 = require("./context");
const _debug = require("debug");
require("reflect-metadata");
const debug = _debug("router");
let Router = class Router {
    constructor() {
    }
    doRoute(target, method, req, res) {
        let cont = this.kernel.get(target);
        debug("Got Controller", cont);
        let args = [];
        let methodParams = Reflect.getMetadata("design:paramtypes", cont, method);
        debug("method parameters", methodParams);
        Object.keys(req.params).forEach((param) => {
            args.push(req.params[param]);
        });
        cont.context = new context_1.Context(req, res);
        let result = cont[method].apply(cont, args);
        result.handle(res);
    }
};
Router = __decorate([
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [])
], Router);
exports.Router = Router;
