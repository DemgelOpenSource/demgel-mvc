import * as e from "express";
import { INewable } from 'inversify';
import { Router } from "./router";
import "reflect-metadata";
export declare const express: Symbol;
export declare const router: Symbol;
export declare enum AllowedMethods {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
}
/**
 * The DI kernel, should only be used with care and only if you know what you are doing.
 * The DI kernel is documented on inversify's website
 */
export declare var kernel: inversify.IKernel;
export declare function getServer(): e.Express;
/**
 * The main function called to create a ExpressMvc object, initialized the DI and returns a useable ExpressMvc object
 *
 * @param {...mvcController} ...controllers The list of controllers to add to DI, all controllers used are required.
 * @return {ExpressMvc}
 */
export declare function expressMvc(...controllers: any[]): ExpressMvc;
export declare class ExpressMvc {
    router: Router;
    running: boolean;
    busboy: {
        allowUpload: boolean;
        uploadPath: string;
    };
    constructor(router: Router);
    /**
     * Add a Transient service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} service The service to add to the DI
     * @return {ExpressMvc}
     */
    addTransient<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc;
    /**
     * Add a Singleton service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} service The service to add to the DI
     * @return {ExpressMvc}
     */
    addSingleton<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc;
    /**
     * An IOptions object to add to the DI, usually used by services for configuration
     *
     * @param {string | Symbol | INewable<T>} identifier The string/Symbol/class to identify this object in the DI
     * @return {ExpressMvc}
     */
    addOptions<T>(identifier: string | Symbol | INewable<T>, constantObj: T): ExpressMvc;
    /**
     * Should uploads be allowed
     *
     * @param {string} path The path the files should be saved too.
     * @return {ExpressMvc}
     */
    allowUpload(path?: string): ExpressMvc;
    /**
     * Set the view engine to be used by express to render views
     *
     * @param {string} engine The name of the view engine to use, defaults to 'pug'
     * @param {string} directory The base directory that contains the views
     * @return {ExpressMvc}
     */
    setViewEngine(engine: string, directory: string): ExpressMvc;
    /**
     * Adds support for sending favicon.ico
     *
     * @param {string} path The path to the favicon.ico files
     * @return {ExpressMvc}
     */
    setFavicon(path: string): ExpressMvc;
    /**
     * Adds a directory to serve static files from
     *
     * @param {string} path The directory to serve static files from, defaults to ./public
     * @return {ExpressMvc}
     */
    addStatic(path: string): ExpressMvc;
    /**
     * Begin listening for connections, also finalizes many configuration options
     *
     * @param {number} port (Optional) The port to listen on for connections
     * @param {string} host (Optional) The host address to listen on, if left blank will use 0.0.0.0
     * @return {ExpressMvc}
     */
    listen(port?: number, host?: string): ExpressMvc;
}
