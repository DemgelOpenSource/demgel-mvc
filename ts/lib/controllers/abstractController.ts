import {injectable} from "inversify";

@injectable()
export abstract class mvcController {
    routes: any;

    constructor() {
    }
}