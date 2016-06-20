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
import {ErrorResult} from "../result/error";
import {Result} from "../result/result";
import {mvcModel} from "../models/mvcModel";
import {required} from "../decorators/object-validation/required";
import * as t from "../decorators/object-validation/validator-builder";

@Model()
export class Test extends mvcModel {
    @required()
    value: string;

    @t.testSuccessValidator({hello: 'dick'})
    success: boolean;

    @required()    
    @t.testFailValidator
    fail: boolean;

    @t.isNumber
    number: number;
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
    anotherFunction(test: string, @fromBody test2?: Test): Result {
 
        if (!test2.isValid()) {
            return new ErrorResult(500, "Test Model is not valid");
        }

        return new RedirectResult(TestController);
    }

    @HttpPost()
    failFunction(): JsonResult {
        console.log(this.context.request.body);
        return new JsonResult({ test: "Hello", property: "Test" });
    }
}