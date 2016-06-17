import { Result } from "./result";
import { Response } from "express";
import { RouteBuilder } from "../router";
export declare class RedirectResult extends Result {
    private method?;
    controller: string;
    router: RouteBuilder;
    constructor(controller: any | string, method?: string, options?: Object);
    handle(res: Response): void;
}
