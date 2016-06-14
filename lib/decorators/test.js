"use strict";
const express_mvc_1 = require("../express-mvc");
function test() {
    return (target, propertyKey, descriptor) => {
        console.log(express_mvc_1.kernel);
    };
}
exports.test = test;
