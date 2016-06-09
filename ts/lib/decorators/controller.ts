import "reflect-metadata";
import {mvcController} from "../controllers/abstractController";

export const controllerName = Symbol("controller-name");

/**
 * baseRoute if null will use the name of the controller lowercased (HelloController becomes hello)
 *
 * It is not required but if Controller is at the end, it will be removed for the route name
 */
export function Controller(baseRoute?: string) {
    return (target: any) => {
        if (baseRoute) {
            Reflect.defineMetadata(controllerName, baseRoute, target);
        } else {
            // TODO: for now throw, later will add support for not name
            throw new Error("Currently not implemented, please supply a name to the controller: " + target);
        }
    }
}

export function GetControllerName(target: any): string {
    return Reflect.getMetadata(controllerName, target) as string;
}

/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export function HttpGet(route?: string | boolean) {
    return (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        target.routes = target.routes || {};
        target.routes.get = target.routes.get || {};

        if (!route) {
            route = require('to-slug-case')(propertyKey);
        } else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }

        if (target.routes.get[<string>route]) {
            throw new Error("Route names need to be unique on methods");
        }

        target.routes.get[<string>route] = propertyKey;
    }
}

/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export function HttpPost(route?: string | boolean) {
    return (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        target.routes = target.routes || {};
        target.routes.post = target.routes.post || {};

        if (!route) {
            route = require('to-slug-case')(propertyKey);
        } else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }

        if (target.routes.post[<string>route]) {
            throw new Error("Route names need to be unique on methods");
        }

        target.routes.post[<string>route] = propertyKey;
    }
}

/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export function HttpDelete(route?: string | boolean) {
    return (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        target.routes = target.routes || {};
        target.routes.del = target.routes.del || {};

        if (!route) {
            route = require('to-slug-case')(propertyKey);
        } else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }

        if (target.routes.del[<string>route]) {
            throw new Error("Route names need to be unique on methods");
        }

        target.routes.del[<string>route] = propertyKey;
    }
}

/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export function HttpPut(route?: string | boolean) {
    return (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        target.routes = target.routes || {};
        target.routes.put = target.routes.put || {};

        if (!route) {
            route = require('to-slug-case')(propertyKey);
        } else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }

        if (target.routes.put[<string>route]) {
            throw new Error("Route names need to be unique on methods");
        }

        target.routes.put[<string>route] = propertyKey;
    }
}