/// <reference types="express" />
/// <reference types="node" />
import * as e from "express";
import { interfaces as i } from 'inversify';
import { RouteBuilder } from "./router";
import { DefaultOptions } from "./options/defaults";
import { Server } from "http";
export declare enum AllowedMethods {
    ALL = 0,
    GET = 1,
    POST = 2,
    PUT = 3,
    DELETE = 4,
    PATCH = 5,
}
export interface ExpressMvc {
}
export declare class ExpressMvc {
    routerBuilder: RouteBuilder;
    defaults: DefaultOptions;
    running: boolean;
    express: e.Express;
    httpServer: Server;
    kernel: i.Kernel;
    constructor(routerBuilder: RouteBuilder, defaults: DefaultOptions);
    /**
     * Add a Transient service to DI
     *
     * If service and identifier are both of type class, only identifier is required (MUST BE CLASS)
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} (Optional if identifier is class to register) service The service to add to the DI
     * @return {ExpressMvc}
     */
    addTransient<T>(identifier: i.ServiceIdentifier<T>, service?: any): ExpressMvc;
    /**
     * Add a Singleton service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} (Optional if identifier is class to register) service The service to add to the DI
     * @return {ExpressMvc}
     */
    addSingleton<T>(identifier: i.ServiceIdentifier<T>, service?: any): ExpressMvc;
    /**
     * An IOptions object to add to the DI, usually used by services for configuration
     *
     * @param {string | Symbol | INewable<T>} identifier The string/Symbol/class to identify this object in the DI
     * @return {ExpressMvc}
     */
    addOptions<T>(identifier: i.ServiceIdentifier<T>, constantObj: T): ExpressMvc;
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
    setViewEngine(directory: string, engine?: string, engineImpl?: any): ExpressMvc;
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
    addStaticFilesPath(path: string): ExpressMvc;
    /**
     * Begin listening for connections, also finalizes many configuration options
     *
     * @param {number} port (Optional) The port to listen on for connections
     * @param {string} host (Optional) The host address to listen on, if left blank will use 0.0.0.0
     * @return {ExpressMvc}
     */
    listen(port?: number, host?: string): ExpressMvc;
}
