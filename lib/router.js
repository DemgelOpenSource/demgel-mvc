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
const lodash_1 = require("lodash");
const _debug = require("debug");
const debug = _debug("router");
let Router = class Router {
    constructor() {
        this.controllerMap = {};
    }
    route(req, res) {
        var cont;
        var result;
        var method;
        var controller;
        var params = lodash_1.clone(req.params);
        var foundController = false;
        var foundMethod = false;
        // Lets set the controller here
        if (req.params.one) {
            controller = req.params.one || null;
            method = req.params.two || null;
        }
        this.getController(controller)
            .then(cont => {
            // Found
            debug("Found Controller " + controller);
            foundController = true;
            return cont;
        })
            .catch(rejected => {
            method = req.params.one || null;
            debug("Failed to find controller, looking for index");
            return this.getController('index');
        })
            .then(cont => {
            let handle = null;
            switch (req.method) {
                case 'PUT':
                    if (cont.routes && cont.routes.put && cont.routes.put[method]) {
                        foundMethod = true;
                        handle = cont.routes.put[method];
                    }
                    else if (cont.routes && cont.routes.put && cont.routes.put.default) {
                        handle = cont.routes.put.default;
                    }
                    break;
                case 'POST':
                    if (cont.routes && cont.routes.post && cont.routes.post[method]) {
                        foundMethod = true;
                        handle = cont.routes.post[method];
                    }
                    else if (cont.routes && cont.routes.post && cont.routes.post.default) {
                        handle = cont.routes.post.default;
                    }
                    break;
                case 'DELETE':
                    if (cont.routes && cont.routes.del && cont.routes.del[method]) {
                        foundMethod = true;
                        handle = cont.routes.del[method];
                    }
                    else if (cont.routes && cont.routes.del && cont.routes.del.default) {
                        handle = cont.routes.del.default;
                    }
                    break;
                case 'GET':
                    if (cont.routes && cont.routes.get && cont.routes.get[method]) {
                        foundMethod = true;
                        handle = cont.routes.get[method];
                    }
                    else if (cont.routes && cont.routes.get && cont.routes.get.default) {
                        handle = cont.routes.get.default;
                    }
                    break;
                default:
                    res.status(500).send("Method not handled " + req.method);
                    return;
            }
            if (foundController && foundMethod) {
                delete params.one;
                delete params.two;
            }
            else if (foundController || foundMethod) {
                delete params.one;
            }
            if (handle) {
                let args = [];
                let methodParams = Reflect.getMetadata("design:paramtypes", cont, handle);
                Object.keys(params).forEach((param) => {
                    if (params[param]) {
                        args.push(params[param]);
                    }
                });
                debug("Passing args to method: ", args);
                if (methodParams.length === args.length) {
                    cont.context = new context_1.Context(req, res);
                    result = cont[handle].apply(cont, args);
                }
                else {
                    res.status(500).send("Bad Request");
                }
            }
            else {
                res.status(404).send("Route Not Found");
                return;
            }
            result.handle(res);
        })
            .catch(err => {
            res.status(500).send("Error resolving controller");
        });
    }
    getController(controller) {
        return new Promise((resolve, reject) => {
            if (!controller || controller === "") {
                reject();
            }
            try {
                var cont = this.kernel.get(controller);
                resolve(cont);
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
Router = __decorate([
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [])
], Router);
exports.Router = Router;
