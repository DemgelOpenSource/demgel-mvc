/// <reference types="express" />
import { Result } from "./result";
import { Response } from "express";
import { RouteBuilder } from "../router";
export declare class RedirectResult extends Result {
    controller: string;
    method: string | undefined;
    options: Object;
    router: RouteBuilder;
    constructor(controller: any | string);
    constructor(controller: any | string, method: string);
    constructor(controller: any | string, options: Object);
    constructor(controller: any | string, method: string, options: Object);
    handle(res: Response): void;
}
