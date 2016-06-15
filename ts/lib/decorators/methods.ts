import {AllowedMethods} from "../express-mvc";
import {RouteBuilder} from "../router";

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpGet(options?: {
        route?: string,
        parameters?: string
    }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = "/" + require('to-slug-case')(propertyKey);
        }

        RouteBuilder.instance.registerHandler(AllowedMethods.GET, options.route, target, propertyKey, options.parameters || "");        
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpPost(options?: {
        route?: string,
        parameters?: string
    }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = "/" + require('to-slug-case')(propertyKey);
        }

        RouteBuilder.instance.registerHandler(AllowedMethods.POST, options.route, target, propertyKey, options.parameters || "");        
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpDelete(options?: {
        route?: string,
        parameters?: string
    }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = "/" + require('to-slug-case')(propertyKey);
        }

        RouteBuilder.instance.registerHandler(AllowedMethods.DELETE, options.route, target, propertyKey, options.parameters || "");        
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpPut(options?: {
        route?: string,
        parameters?: string
    }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = "/" + require('to-slug-case')(propertyKey);
        }

        RouteBuilder.instance.registerHandler(AllowedMethods.PUT, options.route, target, propertyKey, options.parameters || "");        
    }
}