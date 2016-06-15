"use strict";
const express_mvc_1 = require("../express-mvc");
const router_1 = require("../router");
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
function HttpGet(options) {
    return (target, propertyKey, descriptor) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = "/" + require('to-slug-case')(propertyKey);
        }
        router_1.RouteBuilder.instance.registerHandler(express_mvc_1.AllowedMethods.GET, options.route, target, propertyKey, options.parameters || "");
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
            options.route = "/" + require('to-slug-case')(propertyKey);
        }
        router_1.RouteBuilder.instance.registerHandler(express_mvc_1.AllowedMethods.POST, options.route, target, propertyKey, options.parameters || "");
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
            options.route = "/" + require('to-slug-case')(propertyKey);
        }
        router_1.RouteBuilder.instance.registerHandler(express_mvc_1.AllowedMethods.DELETE, options.route, target, propertyKey, options.parameters || "");
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
            options.route = "/" + require('to-slug-case')(propertyKey);
        }
        router_1.RouteBuilder.instance.registerHandler(express_mvc_1.AllowedMethods.PUT, options.route, target, propertyKey, options.parameters || "");
    };
}
exports.HttpPut = HttpPut;
