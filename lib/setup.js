"use strict";
const inversify_1 = require("inversify");
const express_mvc_1 = require("./express-mvc");
const router_1 = require("./router");
const _debug = require("debug");
const defaults_1 = require("./options/defaults");
var debug = _debug("demgel-mvc:setup");
exports.kernel = new inversify_1.Kernel();
exports.pInject = inversify_1.makePropertyInjectDecorator(exports.kernel);
exports.kernel.bind(defaults_1.DefaultOptions).toConstantValue(new defaults_1.DefaultOptions());
exports.kernel.bind(router_1.RouteBuilder).to(router_1.RouteBuilder).inSingletonScope().onActivation((context, router) => {
    router.kernel = exports.kernel;
    return router;
});
exports.kernel.bind(express_mvc_1.ExpressMvc).to(express_mvc_1.ExpressMvc).onActivation((context, expressify) => {
    expressify.kernel = exports.kernel;
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
        exports.kernel.bind(controller).to(controller);
        debug(`Bound controller (${controller.name})`);
    });
    debug('Finished binding controllers...');
    return exports.kernel.get(express_mvc_1.ExpressMvc);
}
exports.expressMvc = expressMvc;
function getRouter() {
    return exports.kernel.get(router_1.RouteBuilder);
}
exports.getRouter = getRouter;
