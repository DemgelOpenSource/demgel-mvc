"use strict";
const setup_1 = require("../setup");
function test() {
    return (target, propertyKey, descriptor) => {
        console.log(setup_1.kernel);
    };
}
exports.test = test;
