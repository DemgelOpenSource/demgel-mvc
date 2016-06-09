"use strict";
require("reflect-metadata");
exports.controllerName = Symbol("controller-name");
/**
 * baseRoute if null will use the name of the controller lowercased (HelloController becomes hello)
 *
 * It is not required but if Controller is at the end, it will be removed for the route name
 */
function Controller(baseRoute) {
    return (target) => {
        if (baseRoute) {
            Reflect.defineMetadata(exports.controllerName, baseRoute, target);
        }
        else {
            // TODO: for now throw, later will add support for not name
            throw new Error("Currently not implemented, please supply a name to the controller: " + target);
        }
    };
}
exports.Controller = Controller;
function GetControllerName(target) {
    return Reflect.getMetadata(exports.controllerName, target);
}
exports.GetControllerName = GetControllerName;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
function HttpGet(route) {
    return (target, propertyKey, descriptor) => {
        target.routes = target.routes || {};
        target.routes.get = target.routes.get || {};
        if (!route) {
            route = require('to-slug-case')(propertyKey);
        }
        else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }
        if (target.routes.get[route]) {
            throw new Error("Route names need to be unique on methods");
        }
        target.routes.get[route] = propertyKey;
    };
}
exports.HttpGet = HttpGet;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
function HttpPost(route) {
    return (target, propertyKey, descriptor) => {
        target.routes = target.routes || {};
        target.routes.post = target.routes.post || {};
        if (!route) {
            route = require('to-slug-case')(propertyKey);
        }
        else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }
        if (target.routes.post[route]) {
            throw new Error("Route names need to be unique on methods");
        }
        target.routes.post[route] = propertyKey;
    };
}
exports.HttpPost = HttpPost;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
function HttpDelete(route) {
    return (target, propertyKey, descriptor) => {
        target.routes = target.routes || {};
        target.routes.del = target.routes.del || {};
        if (!route) {
            route = require('to-slug-case')(propertyKey);
        }
        else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }
        if (target.routes.del[route]) {
            throw new Error("Route names need to be unique on methods");
        }
        target.routes.del[route] = propertyKey;
    };
}
exports.HttpDelete = HttpDelete;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
function HttpPut(route) {
    return (target, propertyKey, descriptor) => {
        target.routes = target.routes || {};
        target.routes.put = target.routes.put || {};
        if (!route) {
            route = require('to-slug-case')(propertyKey);
        }
        else if (route && typeof route === 'boolean' && route === true) {
            route = "default";
        }
        if (target.routes.put[route]) {
            throw new Error("Route names need to be unique on methods");
        }
        target.routes.put[route] = propertyKey;
    };
}
exports.HttpPut = HttpPut;
