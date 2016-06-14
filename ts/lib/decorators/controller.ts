import "reflect-metadata";
import {mvcController} from "../controllers/mvcController";
import {getServer, kernel, router, AllowedMethods} from "../express-mvc";
import {Router} from "../router";

interface Route {
    route: string;
    func: string;
}

export const controllerName = Symbol("controller-name");
export const mvcRoutes = Symbol("mvc-routes");

/**
 * baseRoute if null will use the name of the controller lowercased (HelloController becomes hello)
 *
 * It is not required but if Controller is at the end, it will be removed for the route name
 */
export function Controller(options: {baseRoute?: string, index?: boolean}) {
    return (target: any) => {
        target.path = options.baseRoute;
        let controllerRoute;
        if (options.index) {
            controllerRoute = "";
        } else if (options.baseRoute) {
            controllerRoute = fixPath(options.baseRoute);
        } else {
            // TODO: for now throw, later will add support for not name
            throw new Error("Currently not implemented, please supply a name to the controller: " + target);
        }

        Reflect.defineMetadata(controllerName, controllerRoute, target);

        let routes: Map<AllowedMethods, Array<Route>> = Reflect.getMetadata(mvcRoutes, target);
        routes.forEach((routeArray, idx: AllowedMethods) => {
            routeArray.forEach(route => {
                getServer()[AllowedMethods[idx].toLowerCase()](`${controllerRoute}${route.route}`, (req, res) => {
                    kernel.get<Router>(router).doRoute(target, route.func, req, res);
                });
            });
        });
    }
}

export function GetControllerName(target: any): string {
    return Reflect.getMetadata(controllerName, target) as string;
}

function addRoute(target: any, method: AllowedMethods, route: string, func: string, parameters: string) {
    var routes: Map<AllowedMethods, Array<Route>> = Reflect.getMetadata(mvcRoutes, target);
    if (!routes) {
        routes = new Map<AllowedMethods, Array<Route>>();
    }
    if (!routes.has(method)) {
        routes.set(method, []);
    }
    route = fixPath(route);
    parameters = fixPath(parameters);

    var routeArray = routes.get(method);
    routeArray.push({ route: route + parameters, func: func });

    Reflect.defineMetadata(mvcRoutes, routes, target);
}

function fixPath(path: string): string {
    if (path.substr(0, 1) !== "/") {
        path = "/" + path;
    }

    return path;
}

/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export function HttpGet(options?: {
        route?: string,
        parameters?: string
    }) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }

        addRoute(target.constructor, AllowedMethods.GET, options.route, propertyKey, options.parameters || "");
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpPost(options: {
        route?: string,
        parameters?: string
    }) {
    return (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }

        addRoute(target.constructor, AllowedMethods.POST, options.route, propertyKey, options.parameters || "");
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpDelete(options: {
        route?: string,
        parameters?: string
    }) {
    return (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }

        addRoute(target.constructor, AllowedMethods.DELETE, options.route, propertyKey, options.parameters || "");
    }
}

/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export function HttpPut(options: {
        route?: string,
        parameters?: string
    }) {
    return (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }

        addRoute(target.constructor, AllowedMethods.PUT, options.route, propertyKey, options.parameters || "");
    }
}