/// <reference path="../node_modules/inversify-dts/inversify/inversify.d.ts" />
import "reflect-metadata";
export declare const express: Symbol;
export declare const router: Symbol;
export declare function expressMvc(...controllers: any[]): ExpressMvcInterface;
export interface ExpressMvcInterface {
    addSingleton<T>(identifier: string, service: any): any;
    addTransient<T>(identifier: string, service: any): any;
    start(): any;
}
