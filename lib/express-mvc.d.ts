/// <reference path="../node_modules/inversify-dts/inversify/inversify.d.ts" />
import "reflect-metadata";
export declare const express: Symbol;
export declare const router: Symbol;
export declare function expressMvc(...controllers: any[]): ExpressMvcInterface;
export interface ExpressMvcInterface {
    addSingleton<T>(identifier: string, service: any): ExpressMvcInterface;
    addTransient<T>(identifier: string, service: any): ExpressMvcInterface;
    setViewEngine(engine: string, directory: string): ExpressMvcInterface;
    setFavicon(path: string): ExpressMvcInterface;
    addStatic(path: string): ExpressMvcInterface;
    listen(port?: number, host?: string): any;
}
