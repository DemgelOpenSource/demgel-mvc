import {mvcController} from "../controllers/mvcController";
import {Controller} from "../decorators/controller";
import {logger, methodLogger} from "../decorators/exampleDecorators";
import {fromBody} from "../decorators/parameters";
import {Model} from "../decorators/object-validation/model";
import {HttpGet, HttpPost} from "../decorators/methods";
import {test} from "../decorators/test";
import {TestService} from "./testService";
import {inject, injectable} from "inversify";
import {JsonResult} from "../result/json";
import {View} from "../result/view";
import {RedirectResult} from "../result/redirect";

@Model()
export class Test {
    value: string;
}

@Controller("/")
@logger() 
@injectable()    
export class TestController extends mvcController {
    constructor(test: TestService) {
        super();
        test.doSomething();
    }

    @HttpGet({route: '/'})
    @methodLogger()
    someFunction(): View {
        return new View(this, "someFunction", { pageTitle: 'someFuntion' });
    }

    @HttpPost({route: '/test', parameters: '/:test/:test2?'})
    anotherFunction(test: string, @fromBody test2?: Test) {
        console.log("VALUES: ", test, test2);
        if (!this.context.model.isValid) {
            console.log(this.context.model);
        }
        return new RedirectResult(TestController);
    }

    @HttpPost()
    failFunction(): JsonResult {
        console.log(this.context.request.body);
        return new JsonResult({ test: "Hello", property: "Test" });
    }
}