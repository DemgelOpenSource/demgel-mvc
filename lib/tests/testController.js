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
const controller_1 = require("../decorators/controller");
const methods_1 = require("../decorators/methods");
const testService_1 = require("./testService");
const inversify_1 = require("inversify");
const json_1 = require("../result/json");
const view_1 = require("../result/view");
const redirect_1 = require("../result/redirect");
let TestController_1;
let TestController = TestController_1 = class TestController extends mvcController_1.mvcController {
    constructor(test) {
        super();
        test.doSomething();
    }
    someFunction() {
        return new view_1.View(this, "someFunction", { pageTitle: 'someFuntion' });
    }
    anotherFunction(test, test2) {
        console.log("VALUES: ", test, test2);
        return new redirect_1.RedirectResult(TestController_1, "some-function");
    }
    failFunction() {
        console.log(this.context.request.body);
        return new json_1.JsonResult({ test: "Hello", property: "Test" });
    }
};
__decorate([
    methods_1.HttpGet(),
    controller_1.methodLogger(), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', view_1.View)
], TestController.prototype, "someFunction", null);
__decorate([
    methods_1.HttpGet({ route: '/test', parameters: '/:test/:test2?' }), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String, String]), 
    __metadata('design:returntype', void 0)
], TestController.prototype, "anotherFunction", null);
__decorate([
    methods_1.HttpPost(), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', json_1.JsonResult)
], TestController.prototype, "failFunction", null);
TestController = TestController_1 = __decorate([
    controller_1.Controller("/"),
    controller_1.logger(),
    __param(0, inversify_1.inject("TestService")), 
    __metadata('design:paramtypes', [testService_1.TestService])
], TestController);
exports.TestController = TestController;
