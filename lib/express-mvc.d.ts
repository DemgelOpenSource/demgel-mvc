import * as e from "express";
import { INewable } from 'inversify';
import { Router } from "./router";
import "reflect-metadata";
export declare const express: Symbol;
export declare const router: Symbol;
export declare const kernel: inversify.IKernel;
export declare function expressMvc(...controllers: any[]): ExpressMvc;
export declare class ExpressMvc {
    router: Router;
    running: boolean;
    server: e.Express;
    busboy: {
        allowUpload: boolean;
        uploadPath: string;
    };
    constructor(router: Router);
    addTransient<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc;
    addSingleton<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc;
    addOptions<T>(identifier: string | Symbol | INewable<T>, constantObj: any): void;
    allowUpload(path?: string): void;
    setViewEngine(engine: string, directory: string): ExpressMvc;
    setFavicon(path: string): ExpressMvc;
    addStatic(path: string): ExpressMvc;
    listen(port?: number, host?: string): ExpressMvc;
}
