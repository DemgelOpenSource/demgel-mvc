import {mvcController} from "../lib/controllers/abstractController";
import {Controller, HttpGet} from "../lib/decorators/controller";
import {TestService} from "./testService";
import {View} from "../lib/result/view";
import {inject} from "inversify";
import {JsonResult} from "../lib/result/json";

@Controller({baseRoute: "test-controller", index: true})
export class TestController extends mvcController {
    constructor(@inject("TestService") test: TestService) {
        super();
        test.doSomething();
    }

    @HttpGet(true)    
    someFunction(): View {
        return new View(this, "someFunction", { pageTitle: 'someFuntion' });
    }

    @HttpGet("hello")
    anotherFunction(test: string, test2?: string) {
        return new View(this, "someFunction", { pageTitle: 'anotherFunction' });
    }

    @HttpGet()
    failFunction(): JsonResult {
        return new JsonResult({ test: "Hello", property: "Test" });
    }
}