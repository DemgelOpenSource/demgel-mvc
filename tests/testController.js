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
const abstractController_1 = require("../lib/controllers/abstractController");
const controller_1 = require("../lib/decorators/controller");
const view_1 = require("../lib/result/view");
const json_1 = require("../lib/result/json");
let TestController = class TestController extends abstractController_1.mvcController {
    constructor() {
        super();
    }
    someFunction() {
        console.log(this);
        return new view_1.View(this, "someFunction", { pageTitle: 'someFuntion' });
    }
    anotherFunction() {
        return new view_1.View(this, "someFunction", { pageTitle: 'anotherFunction' });
    }
    failFunction() {
        return new json_1.JsonResult({ test: "Hello", property: "Test" });
    }
};
__decorate([
    controller_1.HttpGet(true), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', view_1.View)
], TestController.prototype, "someFunction", null);
__decorate([
    controller_1.HttpGet("hello"), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', void 0)
], TestController.prototype, "anotherFunction", null);
__decorate([
    controller_1.HttpGet(), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', json_1.JsonResult)
], TestController.prototype, "failFunction", null);
TestController = __decorate([
    controller_1.Controller("test-controller"), 
    __metadata('design:paramtypes', [])
], TestController);
exports.TestController = TestController;
