import { IKernel } from "inversify";
import { mvcController } from "./controllers/mvcController";
import { Request, Response } from "express";
export declare class Router {
    kernel: IKernel;
    constructor();
    route(req: Request, res: Response): void;
    getController(controller: string): Promise<mvcController>;
}
