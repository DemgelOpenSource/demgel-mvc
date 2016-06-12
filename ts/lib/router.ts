import {injectable, IKernel} from "inversify";
import {mvcController} from "./controllers/mvcController";
import {GetControllerName} from "./decorators/controller";
import {Request, Response} from "express";
import {Result} from "./result/result";
import {ErrorResult} from "./result/errorResult";
import {Context} from "./context";
import {clone} from "lodash";
import * as _debug from "debug";

const debug = _debug("router");
@injectable()
export class Router {
    kernel: IKernel;

    // controllerMap: { [key: string]: mvcController } = {};
    
    constructor() {   
    }

    route(req: Request, res: Response) {
        var cont: mvcController;
        var result: Result;
        var method: string;
        var controller: string;
        var params = clone(req.params);
        var foundController = false;
        var foundMethod = false;

        // Lets set the controller here
        if (req.params.one) {
            controller = req.params.one || null;
            method = req.params.two || null;
        }
        
        this.getController(controller)
            .then(cont => {
                // Found
                debug("Found Controller " + controller);
                foundController = true;
                return cont;
            })
            .catch(rejected => {
                method = req.params.one || null;
                debug("Failed to find controller, looking for index");
                return this.getController('index');
            })
            .then(cont => {
                let handle: string = null;
                switch (req.method) {
                    case 'PUT':
                        if (cont.routes && cont.routes.put && cont.routes.put[method]) {
                            foundMethod = true;
                            handle = cont.routes.put[method];
                        } else if (cont.routes && cont.routes.put && cont.routes.put.default) {
                            handle = cont.routes.put.default;
                        }
                        break;
                    case 'POST':
                        if (cont.routes && cont.routes.post && cont.routes.post[method]) {
                            foundMethod = true;
                            handle = cont.routes.post[method];
                        } else if (cont.routes && cont.routes.post && cont.routes.post.default) {
                            handle = cont.routes.post.default
                        }
                        break;
                    case 'DELETE':
                        if (cont.routes && cont.routes.del && cont.routes.del[method]) {
                            foundMethod = true;
                            handle = cont.routes.del[method];
                        } else if (cont.routes && cont.routes.del && cont.routes.del.default) {
                            handle = cont.routes.del.default;
                        }
                        break;
                    case 'GET':
                        if (cont.routes && cont.routes.get && cont.routes.get[method]) {
                            foundMethod = true;
                            handle = cont.routes.get[method];
                        } else if (cont.routes && cont.routes.get && cont.routes.get.default) {
                            handle = cont.routes.get.default;
                        }
                        break;
                    default:
                        new ErrorResult(500, `Method not handled ${req.method}`).handle(res);
                        return;
                }
                if (foundController && foundMethod) {
                    delete params.one;
                    delete params.two;
                } else if (foundController || foundMethod) {
                    delete params.one;
                }

                if (handle) {
                    let args: Array<any> = [];
                    let methodParams: Array<any> = Reflect.getMetadata("design:paramtypes", cont, handle);
                    Object.keys(params).forEach((param) => {
                        if (params[param]) {
                            args.push(params[param]);
                        }
                    });
                    debug("Passing args to method: ", args);
                    if (methodParams.length === args.length) {
                        cont.context = new Context(req, res);
                        result = cont[handle].apply(cont, args);
                    } else {
                        debug("args don't match method");
                        new ErrorResult(500, "Bad Request").handle(res);
                    }    
                } else {
                    new ErrorResult(404, "Route Not Found").handle(res);
                    return;
                }
                result.handle(res);
            })
            .catch(err => {
                console.log(err);
                new ErrorResult(500, "Error resolving controller").handle(res);
            })
    }

    getController(controller: string): Promise<mvcController> {
        return new Promise((resolve, reject) => {
            if (!controller || controller === "") {
                reject();
            }
            try {
                var cont = this.kernel.get(controller);
                resolve(cont as mvcController);
            } catch (e) {
                reject(e);
            }    
        })
    }
}