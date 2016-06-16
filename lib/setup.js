"use strict";
const inversify_1 = require("inversify");
const express_mvc_1 = require("./express-mvc");
const router_1 = require("./router");
const _debug = require("debug");
var debug = _debug("expressify:setup");
exports.SYMBOLS = {
    express: "express-mvc",
    router: "router"
};
var k = new inversify_1.Kernel();
exports.pInject = inversify_1.makePropertyInjectDecorator(k);
exports.kernel = k;
k.bind(router_1.RouteBuilder).to(router_1.RouteBuilder).inSingletonScope().onActivation((context, router) => {
    router.kernelInstance = exports.kernel;
    return router;
});
k.bind(express_mvc_1.ExpressMvc).to(express_mvc_1.ExpressMvc).onActivation((context, expressify) => {
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
        debug(`Bound controller (${controller.name})})`);
    });
    debug('Finished binding controllers...');
    let mvc = exports.kernel.get(express_mvc_1.ExpressMvc);
    // mvc.kernel = kernel;
    return mvc;
}
exports.expressMvc = expressMvc;
function getRouter() {
    return exports.kernel.get(router_1.RouteBuilder);
}
exports.getRouter = getRouter;
