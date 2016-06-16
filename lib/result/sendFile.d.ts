import { Result } from "./result";
import { Response } from "express";
export declare class SendFileResult extends Result {
    private path;
    constructor(path: string);
    handle(res: Response): void;
}
