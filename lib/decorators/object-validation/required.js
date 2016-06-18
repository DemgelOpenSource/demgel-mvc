"use strict";
function required() {
    return (target, propertyKey) => {
        let existingRequired = Reflect.getOwnMetadata("required-property", target, propertyKey) || [];
        existingRequired.push(propertyKey);
        Reflect.defineMetadata("required-property", existingRequired, target);
    };
}
exports.required = required;
