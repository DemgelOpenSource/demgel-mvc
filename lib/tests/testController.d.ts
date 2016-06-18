import { mvcController } from "../controllers/mvcController";
import { TestService } from "./testService";
import { JsonResult } from "../result/json";
import { View } from "../result/view";
import { Result } from "../result/result";
import { mvcModel } from "../models/mvcModel";
export declare class Test extends mvcModel {
    value: string;
}
export declare class TestController extends mvcController {
    constructor(test: TestService);
    someFunction(): View;
    anotherFunction(test: string, test2?: Test): Result;
    failFunction(): JsonResult;
}
