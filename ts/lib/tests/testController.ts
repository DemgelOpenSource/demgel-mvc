import {mvcController} from "../controllers/mvcController";
import {Controller, HttpGet} from "../decorators/decorators";
import {TestService} from "./testService";
import {inject} from "inversify";
import {JsonResult, View} from "../result/results";

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