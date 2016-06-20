import * as _debug from "debug";

export function Model() {
    return (target: any) => {
        let isValid = target.prototype.isValid;
        let debug = _debug(`demgel-mvc:model:${target.name}`);
        
        var newIsValid: Function = function () {
            debug("validating model...");
            let required: Array<string> = Reflect.getMetadata("required-property", target.prototype) || [];
            this.errors.clear();
            required.forEach(req => {
                if (!this[req]) {
                    this.errors.set(`required:${req}`, `${req} is required.`);
                }
            });
            debug(`found ${this.errors.size} required errors`);

            let validationErrors: Map<string, string> = Reflect.getMetadata("validation-errors", target.prototype) || new Map<string, string>();
            debug(`found ${validationErrors.size} validation errors`);
            for (let error of validationErrors) {
                debug("processing validation error", error);
                if (!this.errors.has(error)) {
                    debug("setting validation error");
                    this.errors.set(error[0], error[1]);
                }
            }
            return isValid.apply(this);
        }

        target.prototype.isValid = newIsValid;

        return target;
    }
}