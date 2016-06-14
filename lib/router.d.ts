import { IKernel } from "inversify";
import { Request, Response } from "express";
import "reflect-metadata";
export declare class Router {
    kernel: IKernel;
    constructor();
    doRoute(target: any, method: string, req: Request, res: Response): void;
}
