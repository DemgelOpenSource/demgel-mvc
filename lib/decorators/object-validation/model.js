"use strict";
const _debug = require("debug");
function Model() {
    return (target) => {
        let isValid = target.prototype.isValid;
        let debug = _debug(`demgel-mvc:model:${target.name}`);
        var newIsValid = function () {
            debug("validating model...");
            let required = Reflect.getMetadata("required-property", target.prototype) || [];
            this.errors.clear();
            required.forEach(req => {
                if (!this[req]) {
                    this.errors.set(`required:${req}`, `${req} is required.`);
                }
            });
            debug(`found ${this.errors.size} required errors`);
            let validationErrors = Reflect.getMetadata("validation-errors", target.prototype) || new Map();
            debug(`found ${validationErrors.size} validation errors`);
            for (let error of validationErrors) {
                debug("processing validation error", error);
                if (!this.errors.has(error)) {
                    debug("setting validation error");
                    this.errors.set(error[0], error[1]);
                }
            }
            return isValid.apply(this);
        };
        target.prototype.isValid = newIsValid;
        return target;
    };
}
exports.Model = Model;
