import {interfaces as i, Kernel, makePropertyInjectDecorator} from "inversify";
import {ExpressMvc} from "./express-mvc";
import {RouteBuilder} from "./router";
import {mvcController} from "./controllers/mvcController";
import * as _debug from "debug";
import {DefaultOptions} from "./options/defaults";

var debug = _debug("demgel-mvc:setup");

export var kernel: i.Kernel = new Kernel();
export var pInject = makePropertyInjectDecorator(kernel);

kernel.bind<DefaultOptions>(DefaultOptions).toConstantValue(new DefaultOptions());
kernel.bind<RouteBuilder>(RouteBuilder).to(RouteBuilder).inSingletonScope().onActivation((context, router) => {
    router.kernel = kernel;
    return router;
});
kernel.bind<ExpressMvc>(ExpressMvc).to(ExpressMvc).onActivation((context, expressify) => {
    expressify.kernel = kernel;
    return expressify;
});

/**
 * The main function called to create a ExpressMvc object, initialized the DI and returns a useable ExpressMvc object
 *
 * @param {...mvcController} ...controllers The list of controllers to add to DI, all controllers used are required.
 * @return {ExpressMvc}
 */
export function expressMvc(...controllers: any[]): ExpressMvc {
    debug("Starting ExpressMVC");
    // Handle registering Controllers
    controllers.forEach(controller => {
        debug(`Binding controller (${controller.name})`);
        kernel.bind<mvcController>(controller).to(controller);
        debug(`Bound controller (${controller.name})`);
    });
    debug('Finished binding controllers...');
    return kernel.get<ExpressMvc>(ExpressMvc);
}

export function getRouter(): RouteBuilder {
    return kernel.get<RouteBuilder>(RouteBuilder);
}
