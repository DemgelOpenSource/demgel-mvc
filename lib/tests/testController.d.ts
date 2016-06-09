import { mvcController } from "../controllers/abstractController";
import { TestService } from "./testService";
import { View } from "../result/view";
import { JsonResult } from "../result/json";
export declare class TestController extends mvcController {
    constructor(test: TestService);
    someFunction(): View;
    anotherFunction(test: string, test2?: string): View;
    failFunction(): JsonResult;
}
