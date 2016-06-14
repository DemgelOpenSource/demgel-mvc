import {injectable} from "inversify";
import {Context} from '../context';

@injectable()
export abstract class mvcController {
    context: Context;
    constructor() {
    }
}