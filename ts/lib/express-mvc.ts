import * as e from "express";
import {extend} from "express-busboy";
import {Kernel, injectable, inject, INewable} from 'inversify';
import {mvcController} from './controllers/mvcController';
// import {GetControllerName} from './decorators/controller';
import {Router} from "./router";
import * as _debug from "debug";
import * as favicon from "serve-favicon";
import {IOptions} from "./options";
import * as bodyParser from "body-parser";
import "reflect-metadata";

export const express = Symbol("express-mvc");
export const router = Symbol("router");

export enum AllowedMethods {
    GET,
    POST,
    PUT,
    DELETE
}

/**
 * The DI kernel, should only be used with care and only if you know what you are doing.
 * The DI kernel is documented on inversify's website
 */
export var kernel = new Kernel();
const debug = _debug('express-mvc');

const server = e();

export function getServer(): e.Express {
    return server;
}

/**
 * The main function called to create a ExpressMvc object, initialized the DI and returns a useable ExpressMvc object
 *
 * @param {...mvcController} ...controllers The list of controllers to add to DI, all controllers used are required.
 * @return {ExpressMvc}
 */
export function expressMvc(...controllers: any[]): ExpressMvc {
    kernel.bind<ExpressMvc>(express).to(ExpressMvc);
    kernel.bind<Router>(router).to(Router).inSingletonScope();
    debug("Bound Interface and Router");
    // Handle registering Controllers
    controllers.forEach(controller => {
        debug(`Binding controller (${controller.name})`);
        kernel.bind<mvcController>(controller).to(controller);
        debug(`Bound controller (${controller.name})})`);
    });
    debug('Finished binding controllers...');
    return kernel.get<ExpressMvc>(express) as ExpressMvc;
}

@injectable()
export class ExpressMvc {
    running: boolean;

    busboy = { 
        allowUpload: false,
        uploadPath: "./uploads"
    };

    constructor( @inject(router) public router: Router) {
        router.kernel = kernel;

        server.set('views', '../views');
        server.set('view engine', 'pug');
    }

    /**
     * Add a Transient service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} service The service to add to the DI
     * @return {ExpressMvc}
     */    
    addTransient<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        kernel.bind<T>(identifier).to(service);
        return this;
    }

    /**
     * Add a Singleton service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} service The service to add to the DI
     * @return {ExpressMvc}
     */
    addSingleton<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        kernel.bind<T>(identifier).to(service).inSingletonScope();
        return this;
    }

    /**
     * An IOptions object to add to the DI, usually used by services for configuration
     *
     * @param {string | Symbol | INewable<T>} identifier The string/Symbol/class to identify this object in the DI
     * @return {ExpressMvc}
     */
    addOptions<T>(identifier: string | Symbol | INewable<T>, constantObj: T): ExpressMvc {
        kernel.bind<T>(identifier).toConstantValue(constantObj);
        return this;
    }

    /**
     * Should uploads be allowed
     *
     * @param {string} path The path the files should be saved too.
     * @return {ExpressMvc}
     */
    allowUpload(path?: string): ExpressMvc {
        this.busboy.allowUpload = true;
        this.busboy.uploadPath = path || this.busboy.uploadPath;
        return this;
    }   
    
    /**
     * Set the view engine to be used by express to render views
     *
     * @param {string} engine The name of the view engine to use, defaults to 'pug'
     * @param {string} directory The base directory that contains the views
     * @return {ExpressMvc}
     */
    setViewEngine(engine: string, directory: string): ExpressMvc {
        if (this.running) {
            throw new Error("Set view engine before server is started.");
        }

        server.set('views', directory);
        server.set('view engine', engine);
        return this;
    }

    /**
     * Adds support for sending favicon.ico
     *
     * @param {string} path The path to the favicon.ico files
     * @return {ExpressMvc}
     */
    setFavicon(path: string): ExpressMvc {
        server.use(favicon(path));
        return this;
    }

    /**
     * Adds a directory to serve static files from
     *
     * @param {string} path The directory to serve static files from, defaults to ./public
     * @return {ExpressMvc}
     */
    addStatic(path: string): ExpressMvc {
        server.use(e.static(path));
        return this;
    }

    /**
     * Begin listening for connections, also finalizes many configuration options
     *
     * @param {number} port (Optional) The port to listen on for connections
     * @param {string} host (Optional) The host address to listen on, if left blank will use 0.0.0.0
     * @return {ExpressMvc}
     */
    listen(port?: number, host?: string): ExpressMvc {
        port = port || 3000;

        extend(server, this.busboy);

        if (this.busboy.allowUpload) {
            console.log(`Files will be uploaded to ${this.busboy.uploadPath}.`);
        } else {
            console.log('File uploads are not permitted.');
        }

        server.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            this.running = true;
        })

        return this;
    }
}