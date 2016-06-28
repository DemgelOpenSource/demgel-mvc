import * as e from "express";
import {extend} from "express-busboy";
import {injectable, inject, interfaces as i} from 'inversify';
import {RouteBuilder} from "./router";
import * as _debug from "debug";
import * as favicon from "serve-favicon";
import {Context} from "./context";
import {DefaultOptions} from "./options/defaults";
import {mvcService} from "./services/service";
import {createServer, Server} from "http";

export enum AllowedMethods {
    ALL,
    GET,
    POST,
    PUT,
    DELETE,
    PATCH
}

const debug = _debug('demgel-mvc:express-mvc');

export interface ExpressMvc {
}

@injectable()
export class ExpressMvc {
    running: boolean;
    express: e.Express;
    httpServer: Server;
    kernel: i.Kernel;

    constructor(
        public routerBuilder: RouteBuilder,
        public defaults: DefaultOptions
    ) {
        // We need to allow for @demgel/sockets
        this.express = e();
        this.httpServer = createServer(this.express);

        this.express.use((req: e.Request, res: e.Response, next: e.NextFunction) => {
            debug("adding context");
            req.context = new Context(req, res);
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
    addTransient<T>(identifier: i.ServiceIdentifier<T>, service?: any): ExpressMvc {
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
    addSingleton<T>(identifier: i.ServiceIdentifier<T>, service?: any): ExpressMvc {
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
    addOptions<T>(identifier: i.ServiceIdentifier<T>, constantObj: T): ExpressMvc {
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
        this.defaults.busboy.uploadPath = path || this.defaults.busboy.uploadPath;
        return this;
    }   
    
    /**
     * Set the view engine to be used by express to render views
     *
     * @param {string} engine The name of the view engine to use, defaults to 'pug'
     * @param {string} directory The base directory that contains the views
     * @return {ExpressMvc}
     */
    setViewEngine(directory: string, engine?: string, engineImpl?: any): ExpressMvc {
        if (this.running) {
            throw new Error("Set view engine before server is started.");
        }

        this.defaults.views.engine = engine || this.defaults.views.engine;
        this.defaults.views.path = directory;

        if (engineImpl) {
            this.defaults.views.engineImpl = engineImpl;
        }
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
        extend(this.express, this.defaults.busboy);

        if (this.defaults.busboy.allowUpload) {
            console.log(`Files will be uploaded to ${this.defaults.busboy.uploadPath}.`);
        } else {
            console.log('File uploads are not permitted.');
        }

        // Setup Viewengine
        this.express.set('views', this.defaults.views.path);
        this.express.set('view engine', this.defaults.views.engine);
        if (this.defaults.views.engineImpl) {
            this.express.engine(this.defaults.views.engine, this.defaults.views.engineImpl);
        }
        
        // Favicon Setup
        if (this.defaults.favicon.path) {
            this.express.use(favicon(this.defaults.favicon.path));
        }    
        
        // Static Files setup
        this.defaults.staticFiles.paths.forEach(path => {
            this.express.use(e.static(path));
        });
        
        let routes = this.routerBuilder.build();
        
        for (let route of routes) {
            if (!route.path) continue;
            let middleware = this.routerBuilder.sortMiddleware(route.middleware);
            route.router.use(...middleware);
            this.express.use(route.path, route.router); 
        }
        
        this.httpServer.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            this.running = true;
        });

        return this;
    }
}