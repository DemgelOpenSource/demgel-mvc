import {expressMvc} from "../lib/express-mvc";
import {TestController} from "./testController";

let server = expressMvc(TestController);
server.start();