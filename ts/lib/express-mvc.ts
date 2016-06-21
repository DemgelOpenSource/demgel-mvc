import * as e from "express";
import {extend} from "express-busboy";
import {injectable, inject, interfaces as i} from 'inversify';
import {RouteBuilder} from "./router";
import * as _debug from "debug";
import * as favicon from "serve-favicon";
import "reflect-metadata";
import {Context} from "./context";
import {DefaultOptions} from "./options/defaults";
import {mvcService} from "./services/service";

export enum AllowedMethods {
    GET,
    POST,
    PUT,
    DELETE
}

const debug = _debug('demgel-mvc:express-mvc');

export interface ExpressMvc {
    notrunning: boolean;
}

@injectable()
export class ExpressMvc {
    running: boolean;

    busboy = { 
        allowUpload: false,
        uploadPath: "./uploads"
    };

    server: e.Application;
    kernel: i.Kernel;

    constructor(
        private routerBuilder: RouteBuilder,
        private defaults: DefaultOptions
    ) {
        this.server = e();
        this.server.use((req, res, next) => {
            debug("adding context");
            (<any>req).context = new Context(req, res);
            next();
        });
    }

    /**
     * Add a Transient service to DI
     *
     * If service and identifier are both of type class, only identifier is required (MUST BE CLASS)
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} (Optional if identifier is class to register) service The service to add to the DI
     * @return {ExpressMvc}
     */    
    addTransient<T>(identifier: string | Symbol | i.Newable<T>, service?: any): ExpressMvc {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        if (typeof identifier === 'function' && !service) {
            service = service || identifier;
        }    
       
        this.kernel.bind<T>(identifier).to(service);
        return this;
    }

    /**
     * Add a Singleton service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} (Optional if identifier is class to register) service The service to add to the DI
     * @return {ExpressMvc}
     */
    addSingleton<T>(identifier: string | Symbol | i.Newable<T>, service?: any): ExpressMvc {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        if (typeof identifier === 'function' && !service) {
            service = service || identifier;
        }

        this.kernel.bind<T>(identifier).to(service).inSingletonScope();
        return this;
    }

    /**
     * An IOptions object to add to the DI, usually used by services for configuration
     *
     * @param {string | Symbol | INewable<T>} identifier The string/Symbol/class to identify this object in the DI
     * @return {ExpressMvc}
     */
    addOptions<T>(identifier: string | Symbol | i.Newable<T>, constantObj: T): ExpressMvc {
        this.kernel.bind<T>(identifier).toConstantValue(constantObj);
        return this;
    }

    /**
     * Should uploads be allowed
     *
     * @param {string} path The path the files should be saved too.
     * @return {ExpressMvc}
     */
    allowUpload(path?: string): ExpressMvc {
        this.defaults.busboy.allowUpload = true;
        this.defaults.busboy.uploadPath = path || this.busboy.uploadPath;
        return this;
    }   
    
    /**
     * Set the view engine to be used by express to render views
     *
     * @param {string} engine The name of the view engine to use, defaults to 'pug'
     * @param {string} directory The base directory that contains the views
     * @return {ExpressMvc}
     */
    setViewEngine(directory: string, engine?: string): ExpressMvc {
        if (this.running) {
            throw new Error("Set view engine before server is started.");
        }

        this.defaults.views.engine = engine || this.defaults.views.engine;
        this.defaults.views.path = directory;
        return this;
    }

    /**
     * Adds support for sending favicon.ico
     *
     * @param {string} path The path to the favicon.ico files
     * @return {ExpressMvc}
     */
    setFavicon(path: string): ExpressMvc {
        this.defaults.favicon.path = path;
        return this;
    }

    /**
     * Adds a directory to serve static files from
     *
     * @param {string} path The directory to serve static files from, defaults to ./public
     * @return {ExpressMvc}
     */
    addStaticFilesPath(path: string): ExpressMvc {
        this.defaults.staticFiles.paths.push(path);
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

        // Busboy Setup        
        extend(this.server, this.defaults.busboy);

        if (this.defaults.busboy.allowUpload) {
            console.log(`Files will be uploaded to ${this.busboy.uploadPath}.`);
        } else {
            console.log('File uploads are not permitted.');
        }

        // Setup Viewengine
        this.server.set('views', this.defaults.views.path);
        this.server.set('view engine', this.defaults.views.engine);
        
        // Favicon Setup
        if (this.defaults.favicon.path) {
            this.server.use(favicon(this.defaults.favicon.path));
        }    
        
        // Static Files setup
        this.defaults.staticFiles.paths.forEach(path => {
            this.server.use(e.static(path));
        });
        
        let routes = this.routerBuilder.build();
        
        for (let route of routes) {
            let middleware = this.routerBuilder.sortMiddleware(route.middleware);
            this.server.use(route.path, ...middleware, route.router); 
        }
        
        this.server.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            this.running = true;
        })

        return this;
    }
}