export function required() {
    return (target: any, propertyKey: string) => {
        let existingRequired: Array<string> = Reflect.getOwnMetadata("required-property", target, propertyKey) || [];
        existingRequired.push(propertyKey);
        Reflect.defineMetadata("required-property", existingRequired, target);
    }
}