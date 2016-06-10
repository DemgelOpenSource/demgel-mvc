import { Result } from "./result";
import { Response } from "express";
export declare class ErrorResult extends Result {
    private status;
    private message;
    constructor(status: number, message: string);
    handle(res: Response): void;
}
