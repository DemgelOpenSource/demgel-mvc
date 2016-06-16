"use strict";
const express_mvc_1 = require("../express-mvc");
const router_1 = require("../router");
const setup_1 = require("../setup");
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
function HttpGet(options) {
    return (target, propertyKey, descriptor) => {
        if (!options || !options.route) {
            options = options || {};
            options.route = "/" + require('to-slug-case')(propertyKey);
        }
        setup_1.kernel.get(router_1.RouteBuilder).registerHandler(express_mvc_1.AllowedMethods.GET, options.route, target, propertyKey, options.parameters || "");
        // RouteBuilder.instance.registerHandler(AllowedMethods.GET, options.route, target, propertyKey, options.parameters || "");        
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
        setup_1.kernel.get(router_1.RouteBuilder).registerHandler(express_mvc_1.AllowedMethods.GET, options.route, target, propertyKey, options.parameters || "");
        // RouteBuilder.instance.registerHandler(AllowedMethods.POST, options.route, target, propertyKey, options.parameters || "");        
    };
}
exports.HttpPost = HttpPost;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
// export function HttpDelete(options?: {
//         route?: string,
//         parameters?: string
//     }) {
//     return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
//         if (!options || !options.route) {
//             options = options || {};
//             options.route = "/" + require('to-slug-case')(propertyKey);
//         }
//         RouteBuilder.instance.registerHandler(AllowedMethods.DELETE, options.route, target, propertyKey, options.parameters || "");        
//     }
// }
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
// export function HttpPut(options?: {
//         route?: string,
//         parameters?: string
//     }) {
//     return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
//         if (!options || !options.route) {
//             options = options || {};
//             options.route = "/" + require('to-slug-case')(propertyKey);
//         }
//         RouteBuilder.instance.registerHandler(AllowedMethods.PUT, options.route, target, propertyKey, options.parameters || "");        
//     }
// } 
