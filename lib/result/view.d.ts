import { Result } from "./result";
import { Response } from "express";
import { mvcController } from "../controllers/mvcController";
export declare class View extends Result {
    private view;
    private viewOptions;
    controller: string;
    constructor(controller: mvcController | string, view: string, viewOptions?: {
        [key: string]: any;
    });
    handle(res: Response): void;
}
