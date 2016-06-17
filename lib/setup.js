"use strict";
const inversify_1 = require("inversify");
const express_mvc_1 = require("./express-mvc");
const router_1 = require("./router");
const _debug = require("debug");
const defaults_1 = require("./options/defaults");
var debug = _debug("expressify:setup");
var k = new inversify_1.Kernel();
exports.pInject = inversify_1.makePropertyInjectDecorator(k);
k.bind(defaults_1.DefaultOptions).toConstantValue(new defaults_1.DefaultOptions());
k.bind(router_1.RouteBuilder).to(router_1.RouteBuilder).inSingletonScope().onActivation((context, router) => {
    router.kernelInstance = k;
    return router;
});
k.bind(express_mvc_1.ExpressMvc).to(express_mvc_1.ExpressMvc).onActivation((context, expressify) => {
    expressify.kernel = k;
    return expressify;
});
/**
 * The main function called to create a ExpressMvc object, initialized the DI and returns a useable ExpressMvc object
 *
 * @param {...mvcController} ...controllers The list of controllers to add to DI, all controllers used are required.
 * @return {ExpressMvc}
 */
function expressMvc(...controllers) {
    debug("Starting ExpressMVC");
    // Handle registering Controllers
    controllers.forEach(controller => {
        debug(`Binding controller (${controller.name})`);
        k.bind(controller).to(controller);
        debug(`Bound controller (${controller.name})`);
    });
    debug('Finished binding controllers...');
    return k.get(express_mvc_1.ExpressMvc);
}
exports.expressMvc = expressMvc;
function getRouter() {
    return k.get(router_1.RouteBuilder);
}
exports.getRouter = getRouter;
