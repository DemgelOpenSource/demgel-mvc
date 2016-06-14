import "reflect-metadata";
import { mvcController } from "../controllers/mvcController";
export declare const controllerName: Symbol;
export declare const mvcRoutes: Symbol;
/**
 * baseRoute if null will use the name of the controller lowercased (HelloController becomes hello)
 *
 * It is not required but if Controller is at the end, it will be removed for the route name
 */
export declare function Controller(options: {
    baseRoute?: string;
    index?: boolean;
}): (target: any) => void;
export declare function GetControllerName(target: any): string;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export declare function HttpGet(options?: {
    route?: string;
    parameters?: string;
}): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpPost(options: {
    route?: string;
    parameters?: string;
}): (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpDelete(options: {
    route?: string;
    parameters?: string;
}): (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpPut(options: {
    route?: string;
    parameters?: string;
}): (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
