import { IKernel } from "inversify";
import { Request, Response } from "express";
export declare class Router {
    kernel: IKernel;
    private controllerMap;
    constructor();
    route(req: Request, res: Response): void;
    private getController(controller);
}
