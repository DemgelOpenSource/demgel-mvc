export function Model() {
    return (target: any) => {
        var isValid = target.prototype.isValid;
        var required: Array<string> = Reflect.getMetadata("required-property", target.prototype);

        var newIsValid: Function = function () {
            required.forEach(req => {
                if (!this.hasOwnProperty(req)) {
                    this.errors.set(`${req}-required`, `${req} is required.`);
                }
            })
            return isValid.apply(this);
        }

        target.prototype.isValid = newIsValid;

        return target;
    }
}