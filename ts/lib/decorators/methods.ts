import {AllowedMethods} from "../express-mvc";
import {RouteBuilder} from "../router";
import {getRouter} from "../setup";

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpGet(options: MethodOptions = {}) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        RegisterMethod(AllowedMethods[AllowedMethods.PUT], options.route, target, propertyKey, options.parameters || "");
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpPost(options: MethodOptions = {}) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        RegisterMethod(AllowedMethods[AllowedMethods.PUT], options.route, target, propertyKey, options.parameters || "");     
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpDelete(options: MethodOptions = {}) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        RegisterMethod(AllowedMethods[AllowedMethods.PUT], options.route, target, propertyKey, options.parameters || "");     
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpPut(options: MethodOptions = {}) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        RegisterMethod(AllowedMethods[AllowedMethods.PUT], options.route, target, propertyKey, options.parameters || "");
    }
}

export interface MethodOptions {
    route?: string | undefined;
    parameters?: string | undefined;
}

function RegisterMethod(method: string, route: string | undefined, target: any, propertyKey: string, options: string = ""): void {
    if (!route) {
        route = "/" + require('to-slug-case')(propertyKey);
    }

    getRouter().registerHandler(method, route, target, propertyKey, options);        
}