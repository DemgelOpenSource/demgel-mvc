/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const e = require("express");
const inversify_1 = require('inversify');
const controller_1 = require('./decorators/controller');
const router_1 = require("./router");
const _debug = require("debug");
const favicon = require("serve-favicon");
require("reflect-metadata");
exports.express = Symbol("express-mvc");
exports.router = Symbol("router");
const kernel = new inversify_1.Kernel();
const debug = _debug('express-mvc');
function expressMvc(...controllers) {
    kernel.bind(exports.express).to(ExpressMvc);
    kernel.bind(exports.router).to(router_1.Router);
    debug("Bound Interface and Router");
    // Handle registering Controllers
    controllers.forEach(controller => {
        debug(`Binding controller (${controller_1.GetControllerName(controller)})`);
        kernel.bind(controller_1.GetControllerName(controller)).to(controller);
        debug(`Bound controller (${controller_1.GetControllerName(controller)})`);
    });
    debug('Finished binding controllers...');
    return kernel.get(exports.express);
}
exports.expressMvc = expressMvc;
let ExpressMvc = class ExpressMvc {
    constructor(router) {
        this.router = router;
        router.kernel = kernel;
        this.server = e();
        this.server.set('views', '../views');
        this.server.set('view engine', 'pug');
    }
    addTransient(identifier, service) {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }
        kernel.bind(identifier).to(service);
        return this;
    }
    addSingleton(identifier, service) {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }
        kernel.bind(identifier).to(service).inSingletonScope();
        return this;
    }
    setViewEngine(engine, directory) {
        if (this.running) {
            throw new Error("Set view engine before server is started.");
        }
        this.server.set('views', directory);
        this.server.set('view engine', engine);
        return this;
    }
    setFavicon(path) {
        this.server.use(favicon(path));
        return this;
    }
    addStatic(path) {
        this.server.use(e.static(path));
        return this;
    }
    listen(port, host) {
        port = port || 3000;
        // This will call the router which will be from inversify, for now fudge it
        this.server.all("/:one?/:two?/:three?/:four?/:five?/:six?/:seven?", (req, res) => {
            this.router.route(req, res);
        });
        this.server.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            this.running = true;
        });
    }
};
ExpressMvc = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(exports.router)), 
    __metadata('design:paramtypes', [router_1.Router])
], ExpressMvc);
