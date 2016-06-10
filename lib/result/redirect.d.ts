import { Result } from "./result";
import { Response } from "express";
export declare class RedirectResult extends Result {
    private method;
    controller: string;
    constructor(controller: any | string, method?: string, options?: Object);
    handle(res: Response): void;
}
