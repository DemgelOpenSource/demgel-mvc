import * as e from "express";
import {Kernel, injectable, inject, INewable} from 'inversify';
import {mvcController} from './controllers/mvcController';
import {GetControllerName} from './decorators/controller';
import {Router} from "./router";
import * as _debug from "debug";
import * as favicon from "serve-favicon";
import {IOptions} from "./options";
import "reflect-metadata";

export const express = Symbol("express-mvc");
export const router = Symbol("router");

export const kernel = new Kernel();
const debug = _debug('express-mvc');

export function expressMvc(...controllers: any[]): ExpressMvc {
    kernel.bind<ExpressMvc>(express).to(ExpressMvc);
    kernel.bind<Router>(router).to(Router);
    debug("Bound Interface and Router");
    // Handle registering Controllers
    controllers.forEach(controller => {
        debug(`Binding controller (${GetControllerName(controller)})`);
        kernel.bind<mvcController>(GetControllerName(controller)).to(controller);
        debug(`Bound controller (${GetControllerName(controller)})`);
    });
    debug('Finished binding controllers...');
    return kernel.get<ExpressMvc>(express) as ExpressMvc;
}

@injectable()
export class ExpressMvc {
    running: boolean;
    server: e.Express;

    constructor( @inject(router) public router: Router) {
        router.kernel = kernel;

        this.server = e();
        this.server.set('views', '../views');
        this.server.set('view engine', 'pug');
    }

    addTransient<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        kernel.bind<T>(identifier).to(service);
        return this;
    }

    addSingleton<T>(identifier: string | Symbol | INewable<T>, service: any): ExpressMvc {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        kernel.bind<T>(identifier).to(service).inSingletonScope();
        return this;
    }

    addOptions<T>(identifier: string | Symbol | INewable<T>, constantObj: any) {
        kernel.bind<T>(identifier).toConstantValue(constantObj);
    }

    setViewEngine(engine: string, directory: string): ExpressMvc {
        if (this.running) {
            throw new Error("Set view engine before server is started.");
        }

        this.server.set('views', directory);
        this.server.set('view engine', engine);
        return this;
    }

    setFavicon(path: string): ExpressMvc {
        this.server.use(favicon(path));
        return this;
    }

    addStatic(path: string): ExpressMvc {
        this.server.use(e.static(path));
        return this;
    }

    listen(port?: number, host?: string): ExpressMvc {
        port = port || 3000;
        
        // This will call the router which will be from inversify, for now fudge it
        this.server.all("/:one?/:two?/:three?/:four?/:five?/:six?/:seven?", (req, res) => {
            this.router.route(req, res);
        });

        this.server.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            this.running = true;
        })

        return this;
    }
}