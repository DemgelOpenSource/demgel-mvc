import {Result} from "./result";
import {Response} from "express";

export class ErrorResult extends Result {
    constructor(private status: number, private message: string) {
        super();
    }

    handle(res: Response) {
        res.render(`Errors/${this.status}`, { message: this.message }, (err, html) => {
            if (err) {
                res.status(this.status).send(this.message);
            } else {
                res.status(this.status).send(html);
            }    
        });
    }
}