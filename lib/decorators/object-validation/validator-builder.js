"use strict";
function generateValidator(name, validator) {
    return function (target, propertyKey) {
        let _val;
        let getting = false;
        function getter() {
            return _val;
        }
        function setter(value) {
            if (_val !== value) {
                let result = validator(value);
                if (result) {
                    // Add metadata
                    let existingErrors = Reflect.getMetadata("validation-errors", target) || new Map();
                    if (!existingErrors.has(`${name}:${propertyKey}`)) {
                        existingErrors.set(`${name}:${propertyKey}`, result);
                    }
                    Reflect.defineMetadata("validation-errors", existingErrors, target);
                }
                else {
                    // Attempt to remove metadata
                    let existingErrors = Reflect.getMetadata("validation-errors", target) || new Map();
                    if (existingErrors.has(`${name}:${propertyKey}`)) {
                        existingErrors.delete(`${name}:${propertyKey}`);
                    }
                    Reflect.defineMetadata("validation-errors", existingErrors, target);
                }
                _val = value;
            }
        }
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}
exports.generateValidator = generateValidator;
;
exports.testFailValidator = generateValidator("test-validator", (value) => {
    return "There was an error";
});
exports.testSuccessValidator = (options) => generateValidator("test-success-validator", (value) => {
    return null;
});
exports.isNumber = generateValidator("is-number-validator", (value) => {
    if (typeof value !== 'number') {
        return "value is not a number " + value;
    }
    return null;
});
