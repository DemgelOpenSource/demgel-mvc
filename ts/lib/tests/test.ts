import {expressMvc} from "../express-mvc";
import {TestController} from "./testController";
import {TestService} from "./testService";

let server = expressMvc(TestController);
server.addTransient<TestService>("TestService", TestService);
server.setViewEngine('pug', "../../views");
// server.setFavicon('');
server.listen(3000);