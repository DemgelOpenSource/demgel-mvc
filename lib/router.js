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
let Router = class Router {
    constructor() {
    }
    route(req, res) {
        var cont;
        var result;
        var method;
        if (req.params.one) {
            // check for controller
            try {
                cont = this.kernel.get(req.params.one);
            }
            catch (e) {
                // Make this a res
                res.status(404).send("Controller Not Found");
                return;
            }
        }
        else {
            throw new Error("No Controller requested");
        }
        switch (req.method) {
            case 'PUT':
                if (cont.routes && cont.routes.put) {
                    method = cont.routes.put[req.params.two] || cont.routes.put['default'] || null;
                }
                break;
            case 'POST':
                if (cont.routes && cont.routes.post) {
                    method = cont.routes.post[req.params.two] || cont.routes.post['default'] || null;
                }
                break;
            case 'DELETE':
                if (cont.routes && cont.routes.del) {
                    method = cont.routes.del[req.params.two] || cont.routes.del['default'] || null;
                }
                break;
            case 'GET':
                if (cont.routes && cont.routes.get) {
                    method = cont.routes.get[req.params.two] || cont.routes.get.default || null;
                }
                break;
            default:
                res.status(500).send("Method not handled " + req.method);
                return;
        }
        if (method) {
            result = cont[method]();
        }
        else {
            res.status(404).send("Route Not Found");
            return;
        }
        result.handle(res);
    }
};
Router = __decorate([
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [])
], Router);
exports.Router = Router;
