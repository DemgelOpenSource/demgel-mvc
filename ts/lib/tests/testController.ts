import {mvcController} from "../controllers/mvcController";
import {Controller, HttpGet, HttpPost} from "../decorators/controller";
import {test} from "../decorators/test";
import {TestService} from "./testService";
import {inject} from "inversify";
import {JsonResult} from "../result/json";
import {View} from "../result/view";
import {RedirectResult} from "../result/redirect";

@Controller({baseRoute: "test-controller", index: true})
export class TestController extends mvcController {
    constructor(@inject("TestService") test: TestService) {
        super();
        test.doSomething();
    }

    @HttpGet()
    someFunction(): View {
        console.log(this.context.request.body);
        return new View(this, "someFunction", { pageTitle: 'someFuntion' });
    }

    @HttpGet({route: 'test', parameters: ':test/:test2?'})
    anotherFunction(test: string, test2?: string) {
        console.log("VALUES: ", test, test2);
        // return new View(this, "someFunction", { pageTitle: 'anotherFunction' });
        return new RedirectResult(TestController, "some-function");
    }

    // @HttpPost(true)
    // failFunction(): JsonResult {
    //     console.log(this.context.request.body);
    //     return new JsonResult({ test: "Hello", property: "Test" });
    // }
}