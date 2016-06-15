import { mvcController } from "../controllers/mvcController";
import { TestService } from "./testService";
import { View } from "../result/view";
export declare class TestController extends mvcController {
    constructor(test: TestService);
    someFunction(): View;
    anotherFunction(test: string, test2?: string): View;
}
