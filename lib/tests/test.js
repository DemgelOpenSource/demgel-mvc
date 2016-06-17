"use strict";
const setup_1 = require("../setup");
const testController_1 = require("./testController");
const testService_1 = require("./testService");
let server = setup_1.expressMvc(testController_1.TestController);
server.addTransient(testService_1.TestService, testService_1.TestService);
server.setViewEngine("../../views", 'pug');
// server.setFavicon('');
server.listen(3000);
