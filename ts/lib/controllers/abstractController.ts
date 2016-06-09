import {injectable} from "inversify";
import {Context} from '../context';

@injectable()
export abstract class mvcController {
    routes: any;
    context: Context;

    constructor() {
    }
}