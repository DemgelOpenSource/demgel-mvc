"use strict";
function test() {
    return (target, propertyKey, descriptor) => {
        console.log("This will eventually be something that intigrates with unit testing...");
    };
}
exports.test = test;
