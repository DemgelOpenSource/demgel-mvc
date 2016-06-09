import {Result} from "./result";
import {Response} from "express";

export class JsonResult extends Result {
    object: string;

    constructor(obj: Object) {
        super();
        this.object = JSON.stringify(obj);
    }

    handle(res: Response) {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(this.object);
    }
}