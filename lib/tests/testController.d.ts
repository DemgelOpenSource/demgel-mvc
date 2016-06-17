import { mvcController } from "../controllers/mvcController";
import { TestService } from "./testService";
import { JsonResult } from "../result/json";
import { View } from "../result/view";
import { RedirectResult } from "../result/redirect";
export declare class Test {
    value: string;
}
export declare class TestController extends mvcController {
    constructor(test: TestService);
    someFunction(): View;
    anotherFunction(test: string, test2?: Test): RedirectResult;
    failFunction(): JsonResult;
}
