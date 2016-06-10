"use strict";
const express_mvc_1 = require("../express-mvc");
const testController_1 = require("./testController");
const testService_1 = require("./testService");
let server = express_mvc_1.expressMvc(testController_1.TestController);
server.addTransient("TestService", testService_1.TestService);
server.listen(3000);
