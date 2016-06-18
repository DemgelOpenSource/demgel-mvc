import {RouteBuilder} from "../router";
import {RequestHandler} from "express";
import {getRouter} from "../setup";
import {mvcController} from "../controllers/mvcController";
import {Test} from "../tests/testController";
import {Model} from "../context";

export function Controller(path: string) {
    return (target: any) => {
        let frombody: Array<{ propertyKey: string | symbol, parameterIndex: number }> = Reflect.getMetadata("method-frombody", target.prototype);
        
        for (let fb of frombody) {
            let method = target.prototype[fb.propertyKey];

            var f: any = function (...args) {
                let methodParams: Array<any> = Reflect.getMetadata("design:paramtypes", this, fb.propertyKey);
                let t: Object = this.context.request.body;
                let obj: Object = new methodParams[fb.parameterIndex];
                for (let a in t) {
                    obj[a] = t[a];
                }
                args[fb.parameterIndex] = obj;
                return method.apply(this, args);
            }

            target.prototype[fb.propertyKey] = f;
        }

        getRouter().registerController(path, target);
        return target;
    }
}
