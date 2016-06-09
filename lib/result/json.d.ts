import { Result } from "./result";
import { Response } from "express";
export declare class JsonResult extends Result {
    object: string;
    constructor(obj: Object);
    handle(res: Response): void;
}
