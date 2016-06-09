import {injectable} from "inversify";

@injectable()
export class TestService {
    doSomething() {
        console.log("Did Something");
    }
}