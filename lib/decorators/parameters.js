"use strict";
function fromBody(target, propertyKey, parameterIndex) {
    let existingParameterFromBody = Reflect.getOwnMetadata("method-frombody", target, propertyKey) || [];
    existingParameterFromBody.push({ propertyKey: propertyKey, parameterIndex: parameterIndex });
    Reflect.defineMetadata("method-frombody", existingParameterFromBody, target);
}
exports.fromBody = fromBody;
