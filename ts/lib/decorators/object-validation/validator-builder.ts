export function generateValidator(name: string, validator) {
        return function (target: Object, propertyKey: string) {
            let _val;
            let getting = false;
            function getter() {
                return _val;
            }

            function setter(value: any) {
                if (_val !== value) {
                    let result = validator(value);
                    if (result) {
                        // Add metadata
                        let existingErrors: Map<string, string> = Reflect.getMetadata("validation-errors", target) || new Map<string, string>();
                        if (!existingErrors.has(`${name}:${propertyKey}`)) {
                            existingErrors.set(`${name}:${propertyKey}`, result);
                        }
                        Reflect.defineMetadata("validation-errors", existingErrors, target);
                    } else {
                        // Attempt to remove metadata
                        let existingErrors: Map<string, string> = Reflect.getMetadata("validation-errors", target) || new Map<string, string>();
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
        }
    };

export var testFailValidator = generateValidator("test-validator", (value) => {
        return "There was an error";
    });

export var testSuccessValidator = (options) => generateValidator("test-success-validator", (value) => {
    return null;
})

export var isNumber =  generateValidator("is-number-validator", (value) => {
    if (typeof value !== 'number') {
        return "value is not a number " + value;
    }
    return null;
})