import {injectable, Kernel} from "inversify";
import {mvcController} from "./controllers/abstractController";
import {Request, Response} from "express";
import {Result} from "./result/result";

@injectable()
export class Router {
    kernel: any;

    constructor() { }

    route(req: Request, res: Response) {
        var cont: mvcController;
        var result: Result;
        var method: string;

        if (req.params.one) {
            // check for controller
            try {
                cont = this.kernel.get(req.params.one);
            } catch (e) {
                // Make this a res
                res.status(404).send("Controller Not Found");
                return;
            }
        } else {
            throw new Error("No Controller requested");
        }

        switch (req.method) {
            case 'PUT':
                if (cont.routes && cont.routes.put) {
                    method = cont.routes.put[req.params.two] || cont.routes.put['default'] || null;
                }
                break;
            case 'POST':
                if (cont.routes && cont.routes.post) {
                    method = cont.routes.post[req.params.two] || cont.routes.post['default'] || null;
                }
                break;
            case 'DELETE':
                if (cont.routes && cont.routes.del) {
                    method = cont.routes.del[req.params.two] || cont.routes.del['default'] || null;
                }
                break;
            case 'GET':
                if (cont.routes && cont.routes.get) {
                    method = cont.routes.get[req.params.two] || cont.routes.get.default || null;
                }
                break;
            default:
                res.status(500).send("Method not handled " + req.method);
                return;
        }
        if (method) {
            result = cont[method]();
        } else {
            res.status(404).send("Route Not Found");
            return;
        }
        result.handle(res);
    }
}