"use strict";
function Model() {
    return (target) => {
        var isValid = target.prototype.isValid;
        var required = Reflect.getMetadata("required-property", target.prototype);
        var newIsValid = function () {
            required.forEach(req => {
                if (!this.hasOwnProperty(req)) {
                    this.errors.set(`${req}-required`, `${req} is required.`);
                }
            });
            return isValid.apply(this);
        };
        target.prototype.isValid = newIsValid;
        return target;
    };
}
exports.Model = Model;
