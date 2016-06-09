import {mvcController} from "../lib/controllers/abstractController";
import {Controller, HttpGet} from "../lib/decorators/controller";
import {View} from "../lib/result/view";
import {JsonResult} from "../lib/result/json";

@Controller("test-controller")
export class TestController extends mvcController {
    constructor() {
        super();
    }

    @HttpGet(true)    
    someFunction(): View {
        console.log(this);
        return new View(this, "someFunction", { pageTitle: 'someFuntion' });
    }

    @HttpGet("hello")
    anotherFunction() {
        return new View(this, "someFunction", { pageTitle: 'anotherFunction' });
    }

    @HttpGet()
    failFunction(): JsonResult {
        return new JsonResult({ test: "Hello", property: "Test" });
    }
}