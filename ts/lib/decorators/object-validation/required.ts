export function required() {
    return (target: Object, propertyKey: string) => {
        let existingRequired: Array<string> = Reflect.getMetadata("required-property", target) || [];
        existingRequired.push(propertyKey);
        Reflect.defineMetadata("required-property", existingRequired, target);
    }
}