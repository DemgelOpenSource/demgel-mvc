import {mvcController} from "../controllers/mvcController";
import {Controller, logger, methodLogger} from "../decorators/controller";
import {HttpGet, HttpPost} from "../decorators/methods";
import {test} from "../decorators/test";
import {TestService} from "./testService";
import {inject} from "inversify";
import {JsonResult} from "../result/json";
import {View} from "../result/view";
import {RedirectResult} from "../result/redirect";

@Controller("/")
@logger()    
export class TestController extends mvcController {
    constructor(@inject("TestService") test: TestService) {
        super();
        test.doSomething();
    }

    @HttpGet()
    @methodLogger()
    someFunction(): View {
        return new View(this, "someFunction", { pageTitle: 'someFuntion' });
    }

    @HttpGet({route: '/test', parameters: '/:test/:test2?'})
    anotherFunction(test: string, test2?: string) {
        console.log("VALUES: ", test, test2);
        return new RedirectResult(TestController, "some-function");
    }

    @HttpPost()
    failFunction(): JsonResult {
        console.log(this.context.request.body);
        return new JsonResult({ test: "Hello", property: "Test" });
    }
}