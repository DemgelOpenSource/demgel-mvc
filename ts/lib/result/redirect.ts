import {Result} from "./result";
import {Response} from "express";
import {RouteBuilder} from "../router";
import {pInject} from "../setup";

export class RedirectResult extends Result {
    controller: string;

    @pInject(RouteBuilder)
    router: RouteBuilder;

    constructor(controller: any | string, private method?: string, options?: Object) {
        super();
        if (typeof controller === 'string') {
            this.controller = controller + "/";
        } else {
            // let cont = RouteBuilder.instance.getRoute(controller);
            let cont = this.router.getRoute(controller);
            if (cont.path === "/") {
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