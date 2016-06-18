"use strict";
const setup_1 = require("../setup");
function Controller(path) {
    return (target) => {
        let frombody = Reflect.getMetadata("method-frombody", target.prototype);
        for (let fb of frombody) {
            let method = target.prototype[fb.propertyKey];
            var f = function (...args) {
                let methodParams = Reflect.getMetadata("design:paramtypes", this, fb.propertyKey);
                let t = this.context.request.body;
                let obj = new methodParams[fb.parameterIndex];
                for (let a in t) {
                    obj[a] = t[a];
                }
                args[fb.parameterIndex] = obj;
                return method.apply(this, args);
            };
            target.prototype[fb.propertyKey] = f;
        }
        setup_1.getRouter().registerController(path, target);
        return target;
    };
}
exports.Controller = Controller;
