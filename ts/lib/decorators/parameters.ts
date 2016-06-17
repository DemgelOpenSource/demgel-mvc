export function fromBody(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingParameterFromBody: Array<{ propertyKey: string | symbol, parameterIndex: number }> = Reflect.getOwnMetadata("method-frombody", target, propertyKey) || [];
    existingParameterFromBody.push({ propertyKey: propertyKey, parameterIndex: parameterIndex });
    Reflect.defineMetadata("method-frombody", existingParameterFromBody, target);
}