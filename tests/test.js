"use strict";
const express_mvc_1 = require("../lib/express-mvc");
const testController_1 = require("./testController");
let server = express_mvc_1.expressMvc(testController_1.TestController);
server.start();
