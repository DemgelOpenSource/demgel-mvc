import {Result} from "./result";
import {Response} from "express";
import {mvcController} from "../controllers/mvcController";
import {GetControllerName} from "../decorators/controller";

export class RedirectResult extends Result {
    controller: string;

    constructor(controller: any | string, private method?: string, options?: Object) {
        super();
        if (typeof controller === 'string') {
            this.controller = controller;
        } else {
            this.controller = GetControllerName(controller);
        }
    }

    handle(res: Response) {
        var url = "";
        if (this.controller === 'index') {
            url = "";
        } else {
            url = `/${this.controller}`;
        }

        if (this.method) {
            url = `${url}/${this.method}`;
        }
        console.log(url);
        if (url === "") {
            url = "/";
        }
        res.redirect(url);
    }
}