import {injectable, IKernel} from "inversify";
import {mvcController} from "./controllers/mvcController";
// import {GetControllerName} from "./decorators/controller";
import {Request, Response} from "express";
import {Result} from "./result/result";
import {ErrorResult} from "./result/errorResult";
import {Context} from "./context";
import {clone} from "lodash";
import * as _debug from "debug";
import "reflect-metadata";

const debug = _debug("router");

@injectable()
export class Router {
    kernel: IKernel;
    
    constructor() {   
    }

    doRoute(target: any, method: string, req: Request, res: Response) {
        let cont: mvcController = this.kernel.get<mvcController>(target);
        debug("Got Controller", cont);
        let args: Array<any> = [];
        let methodParams: Array<any> = Reflect.getMetadata("design:paramtypes", cont, method);
        debug("method parameters", methodParams);
        Object.keys(req.params).forEach((param) => {
            args.push(req.params[param]);
        });
        cont.context = new Context(req, res);
        let result: Result = cont[method].apply(cont, args);
        result.handle(res);
    }
}