import {Result} from "./result";
import {Response} from "express";
import {mvcController} from "../controllers/mvcController";

export class View extends Result {
    controller: string;

    constructor(controller: mvcController | string, private view: string, private viewOptions?: {[key: string]: any}) {
        super();
        if (typeof controller === 'string') {
            this.controller = controller;
        } else {
            this.controller = controller.constructor.name;
        }
    }

    handle(res: Response) {
        res.render(`${this.controller}/${this.view}`, this.viewOptions || {}, (err: Error, html: string) => {
            if (err) {
                res.status(500).send("Error Message" + err);
            } else {
                res.status(200).send(html);
            }
        });
    }
}