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
const exampleDecorators_1 = require("../decorators/exampleDecorators");
const parameters_1 = require("../decorators/parameters");
const model_1 = require("../decorators/object-validation/model");
const methods_1 = require("../decorators/methods");
const testService_1 = require("./testService");
const inversify_1 = require("inversify");
const json_1 = require("../result/json");
const view_1 = require("../result/view");
const redirect_1 = require("../result/redirect");
const error_1 = require("../result/error");
const result_1 = require("../result/result");
const mvcModel_1 = require("../models/mvcModel");
const required_1 = require("../decorators/object-validation/required");
let Test = class Test extends mvcModel_1.mvcModel {
};
__decorate([
    required_1.required(), 
    __metadata('design:type', String)
], Test.prototype, "value", void 0);
Test = __decorate([
    model_1.Model(), 
    __metadata('design:paramtypes', [])
], Test);
exports.Test = Test;
let TestController_1 = class TestController extends mvcController_1.mvcController {
    constructor(test) {
        super();
        test.doSomething();
    }
    someFunction() {
        return new view_1.View(this, "someFunction", { pageTitle: 'someFuntion' });
    }
    anotherFunction(test, test2) {
        console.log(test2.isValid());
        if (!test2.isValid()) {
            return new error_1.ErrorResult(500, "Test Model is not valid");
        }
        return new redirect_1.RedirectResult(TestController_1);
    }
    failFunction() {
        console.log(this.context.request.body);
        return new json_1.JsonResult({ test: "Hello", property: "Test" });
    }
};
let TestController = TestController_1;
__decorate([
    methods_1.HttpGet({ route: '/' }),
    exampleDecorators_1.methodLogger(), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', view_1.View)
], TestController.prototype, "someFunction", null);
__decorate([
    methods_1.HttpPost({ route: '/test', parameters: '/:test/:test2?' }),
    __param(1, parameters_1.fromBody), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String, Test]), 
    __metadata('design:returntype', result_1.Result)
], TestController.prototype, "anotherFunction", null);
__decorate([
    methods_1.HttpPost(), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', json_1.JsonResult)
], TestController.prototype, "failFunction", null);
TestController = TestController_1 = __decorate([
    controller_1.Controller("/"),
    exampleDecorators_1.logger(),
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [testService_1.TestService])
], TestController);
exports.TestController = TestController;
