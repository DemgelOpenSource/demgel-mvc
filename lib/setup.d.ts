import { interfaces as i } from "inversify";
import { ExpressMvc } from "./express-mvc";
import { RouteBuilder } from "./router";
export declare var k: i.Kernel;
export declare var pInject: (serviceIdentifier: string | Symbol | i.Newable<any>) => (proto: any, key: string) => void;
/**
 * The main function called to create a ExpressMvc object, initialized the DI and returns a useable ExpressMvc object
 *
 * @param {...mvcController} ...controllers The list of controllers to add to DI, all controllers used are required.
 * @return {ExpressMvc}
 */
export declare function expressMvc(...controllers: any[]): ExpressMvc;
export declare function getRouter(): RouteBuilder;
