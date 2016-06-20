"use strict";
function required() {
    return (target, propertyKey) => {
        let existingRequired = Reflect.getMetadata("required-property", target) || [];
        existingRequired.push(propertyKey);
        Reflect.defineMetadata("required-property", existingRequired, target);
    };
}
exports.required = required;
