"use strict";
const setup_1 = require("../setup");
function logger() {
    return (target) => {
        setup_1.getRouter().registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        });
    };
}
exports.logger = logger;
function methodLogger() {
    return (target, propertyKey, descriptor) => {
        setup_1.getRouter().registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        });
    };
}
exports.methodLogger = methodLogger;
