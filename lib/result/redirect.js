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
const result_1 = require("./result");
const router_1 = require("../router");
const setup_1 = require("../setup");
class RedirectResult extends result_1.Result {
    constructor(controller, method, options) {
        super();
        this.method = method;
        if (typeof controller === 'string') {
            this.controller = controller + "/";
        }
        else {
            // let cont = RouteBuilder.instance.getRoute(controller);
            let cont = this.router.getRoute(controller);
            if (cont.path === "/") {
                this.controller = cont.path;
            }
            else {
                this.controller = cont.path + "/";
            }
        }
    }
    handle(res) {
        var url = this.controller;
        if (this.method) {
            url = `${url}${this.method}`;
        }
        res.redirect(url);
    }
}
__decorate([
    setup_1.pInject(router_1.RouteBuilder), 
    __metadata('design:type', router_1.RouteBuilder)
], RedirectResult.prototype, "router", void 0);
exports.RedirectResult = RedirectResult;
