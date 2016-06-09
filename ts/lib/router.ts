import {injectable, Kernel} from "inversify";
import {mvcController} from "./controllers/abstractController";
import {Request, Response} from "express";
import {Result} from "./result/result";
import {Context} from "./context";
import {clone} from "lodash";
import * as _debug from "debug";

@injectable()
export class Router {
    kernel: any;
    debug = _debug("router");
    
    constructor() { }

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
                this.debug("Found Controller " + controller);
                foundController = true;
                return cont;
            })
            .catch(rejected => {
                method = req.params.one || null;
                this.debug("Failed to find controller, looking for index");
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
                        if (cont.routes && cont.routes.post) {
                            handle = cont.routes.post[method] || null;
                        }
                        break;
                    case 'DELETE':
                        if (cont.routes && cont.routes.del) {
                            handle = cont.routes.del[method] || null;
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
                        res.status(500).send("Method not handled " + req.method);
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
                    this.debug("Passing args to method: ", args);
                    if (methodParams.length === args.length) {
                        result = cont[handle].apply(cont, args);
                    } else {
                        res.status(500).send("Bad Request");
                    }    
                } else {
                    res.status(404).send("Route Not Found");
                    return;
                }
                result.handle(res);
            })
            .catch(err => {
                res.status(500).send("Error resolving controller");
            })
    }

    private getController(controller: string): Promise<mvcController> {
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