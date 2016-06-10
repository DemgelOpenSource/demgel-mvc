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
const mvcController_1 = require("../controllers/mvcController");
const decorators_1 = require("../decorators/decorators");
const testService_1 = require("./testService");
const inversify_1 = require("inversify");
const results_1 = require("../result/results");
let TestController = class TestController extends mvcController_1.mvcController {
    constructor(test) {
        super();
        test.doSomething();
    }
    someFunction() {
        return new results_1.View(this, "someFunction", { pageTitle: 'someFuntion' });
    }
    anotherFunction(test, test2) {
        return new results_1.View(this, "someFunction", { pageTitle: 'anotherFunction' });
    }
    failFunction() {
        return new results_1.JsonResult({ test: "Hello", property: "Test" });
    }
};
__decorate([
    decorators_1.HttpGet(true), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', results_1.View)
], TestController.prototype, "someFunction", null);
__decorate([
    decorators_1.HttpGet("hello"), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String, String]), 
    __metadata('design:returntype', void 0)
], TestController.prototype, "anotherFunction", null);
__decorate([
    decorators_1.HttpGet(), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', results_1.JsonResult)
], TestController.prototype, "failFunction", null);
TestController = __decorate([
    decorators_1.Controller({ baseRoute: "test-controller", index: true }),
    __param(0, inversify_1.inject("TestService")), 
    __metadata('design:paramtypes', [testService_1.TestService])
], TestController);
exports.TestController = TestController;
