import * as e from "express";
import {extend} from "express-busboy";
import {IKernel, injectable, inject, INewable} from 'inversify';
import {RouteBuilder} from "./router";
import * as _debug from "debug";
import * as favicon from "serve-favicon";
import "reflect-metadata";
import {Context} from "./context";
import {kernel, SYMBOLS} from "./setup";

export enum AllowedMethods {
    GET,
    POST,
    PUT,
    DELETE
}

const debug = _debug('expressify:express-mvc');

@injectable()
export class ExpressMvc {
    running: boolean;

    busboy = { 
        allowUpload: false,
        uploadPath: "./uploads"
    };

    server: e.Application;
    kernel: IKernel;

    constructor( @inject(RouteBuilder) private routerBuilder: RouteBuilder) {
        this.server = e();
        this.server.use((req, res, next) => {
            debug("adding context");
            (<any>req).context = new Context(req, res);
            next();
        });

        this.server.set('views', '../views');
        this.server.set('view engine', 'pug');
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
       
        this.kernel.bind<T>(identifier).to(service);
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

        this.kernel.bind<T>(identifier).to(service).inSingletonScope();
        return this;
    }

    /**
     * An IOptions object to add to the DI, usually used by services for configuration
     *
     * @param {string | Symbol | INewable<T>} identifier The string/Symbol/class to identify this object in the DI
     * @return {ExpressMvc}
     */
    addOptions<T>(identifier: string | Symbol | INewable<T>, constantObj: T): ExpressMvc {
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

        this.server.set('views', directory);
        this.server.set('view engine', engine);
        return this;
    }

    /**
     * Adds support for sending favicon.ico
     *
     * @param {string} path The path to the favicon.ico files
     * @return {ExpressMvc}
     */
    setFavicon(path: string): ExpressMvc {
        this.server.use(favicon(path));
        return this;
    }

    /**
     * Adds a directory to serve static files from
     *
     * @param {string} path The directory to serve static files from, defaults to ./public
     * @return {ExpressMvc}
     */
    addStatic(path: string): ExpressMvc {
        this.server.use(e.static(path));
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

        extend(this.server, this.busboy);

        if (this.busboy.allowUpload) {
            console.log(`Files will be uploaded to ${this.busboy.uploadPath}.`);
        } else {
            console.log('File uploads are not permitted.');
        }

        // let routes = RouteBuilder.instance.build();
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