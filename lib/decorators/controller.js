"use strict";
require("reflect-metadata");
const express_mvc_1 = require("../express-mvc");
exports.controllerName = Symbol("controller-name");
exports.mvcRoutes = Symbol("mvc-routes");
/**
 * baseRoute if null will use the name of the controller lowercased (HelloController becomes hello)
 *
 * It is not required but if Controller is at the end, it will be removed for the route name
 */
function Controller(options) {
    return (target) => {
        target.path = options.baseRoute;
        let controllerRoute;
        if (options.index) {
            controllerRoute = "";
        }
        else if (options.baseRoute) {
            controllerRoute = fixPath(options.baseRoute);
        }
        else {
            // TODO: for now throw, later will add support for not name
            throw new Error("Currently not implemented, please supply a name to the controller: " + target);
        }
        Reflect.defineMetadata(exports.controllerName, controllerRoute, target);
        let routes = Reflect.getMetadata(exports.mvcRoutes, target);
        routes.forEach((routeArray, idx) => {
            routeArray.forEach(route => {
                express_mvc_1.getServer()[express_mvc_1.AllowedMethods[idx].toLowerCase()](`${controllerRoute}${route.route}`, (req, res) => {
                    express_mvc_1.kernel.get(express_mvc_1.router).doRoute(target, route.func, req, res);
                });
            });
        });
    };
}
exports.Controller = Controller;
function GetControllerName(target) {
    return Reflect.getMetadata(exports.controllerName, target);
}
exports.GetControllerName = GetControllerName;
function addRoute(target, method, route, func, parameters) {
    var routes = Reflect.getMetadata(exports.mvcRoutes, target);
    if (!routes) {
        routes = new Map();
    }
    if (!routes.has(method)) {
        routes.set(method, []);
    }
    route = fixPath(route);
    parameters = fixPath(parameters);
    var routeArray = routes.get(method);
    routeArray.push({ route: route + parameters, func: func });
    Reflect.defineMetadata(exports.mvcRoutes, routes, target);
}
function fixPath(path) {
    if (path.substr(0, 1) !== "/") {
        path = "/" + path;
    }
    return path;
}
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
function HttpGet(options) {
    return (target, propertyKey, descriptor) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }
        addRoute(target.constructor, express_mvc_1.AllowedMethods.GET, options.route, propertyKey, options.parameters || "");
    };
}
exports.HttpGet = HttpGet;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
function HttpPost(options) {
    return (target, propertyKey, descriptor) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }
        addRoute(target.constructor, express_mvc_1.AllowedMethods.POST, options.route, propertyKey, options.parameters || "");
    };
}
exports.HttpPost = HttpPost;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
function HttpDelete(options) {
    return (target, propertyKey, descriptor) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }
        addRoute(target.constructor, express_mvc_1.AllowedMethods.DELETE, options.route, propertyKey, options.parameters || "");
    };
}
exports.HttpDelete = HttpDelete;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
function HttpPut(options) {
    return (target, propertyKey, descriptor) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = require('to-slug-case')(propertyKey);
        }
        addRoute(target.constructor, express_mvc_1.AllowedMethods.PUT, options.route, propertyKey, options.parameters || "");
    };
}
exports.HttpPut = HttpPut;
