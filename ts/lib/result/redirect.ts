import {Result} from "./result";
import {Response} from "express";
import {RouteBuilder} from "../router";
import {pInject} from "../setup";

export class RedirectResult extends Result {
    controller: string;
    method: string | undefined;
    options: Object;

    @pInject(RouteBuilder)
    router: RouteBuilder;

    constructor(controller: any | string)    
    constructor(controller: any | string, method: string)
    constructor(controller: any | string, options: Object)
    constructor(controller: any | string, method: string, options: Object)
    constructor(controller: any | string, method?: string | Object, options?: Object) {
        super();
        if (method) {
            if (typeof method === "string") {
                this.method = method;
            } else {
                this.method = undefined;
                if (!options) {
                    this.options = method;
                } else {
                    this.options = options;
                }
            }
        }
        if (typeof controller === 'string') {
            this.controller = controller + "/";
        } else {
            let cont = this.router.getRoute(controller);
            if (!cont) {
                throw new Error("Redirect Controller not found");
            }
            if (cont.path && cont.path === "/") {
                this.controller = cont.path;
            } else {
                this.controller = cont.path + "/";
            }    
        }
    }

    handle(res: Response) {
        var url = this.controller;

        if (this.method) {
            url = `${url}${this.method}`;
        }
        res.redirect(url);
    }
}