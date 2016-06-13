import {mvcController} from "../controllers/mvcController";
import {Controller, HttpGet, HttpPost} from "../decorators/controller";
import {TestService} from "./testService";
import {inject} from "inversify";
import {JsonResult} from "../result/json";
import {View} from "../result/view";

@Controller({baseRoute: "test-controller", index: true})
export class TestController extends mvcController {
    constructor(@inject("TestService") test: TestService) {
        super();
        test.doSomething();
    }

    @HttpGet(true)    
    someFunction(): View {
        console.log(this.context.request.body);
        return new View(this, "someFunction", { pageTitle: 'someFuntion' });
    }

    @HttpGet("hello")
    anotherFunction(test: string, test2?: string) {
        return new View(this, "someFunction", { pageTitle: 'anotherFunction' });
    }

    @HttpPost(true)
    failFunction(): JsonResult {
        console.log(this.context.request.body);
        return new JsonResult({ test: "Hello", property: "Test" });
    }
}