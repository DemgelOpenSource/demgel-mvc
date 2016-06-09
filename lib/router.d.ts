import { IKernel } from "inversify";
import { Request, Response } from "express";
import * as _debug from "debug";
export declare class Router {
    kernel: IKernel;
    debug: _debug.IDebugger;
    constructor();
    route(req: Request, res: Response): void;
    private getController(controller);
}
