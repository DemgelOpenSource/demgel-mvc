import {Result} from "./result";
import {Response} from "express";
import {pInject} from "../setup";

export class SendFileResult extends Result {
    
    constructor(private path: string) {
        super();
    }

    handle(res: Response) {
        res.sendFile(this.path);
    }
}