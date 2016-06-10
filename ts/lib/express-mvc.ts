/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />

import * as e from "express";
import {Kernel, injectable, inject} from 'inversify';
import {mvcController} from './controllers/mvcController';
import {GetControllerName} from './decorators/controller';
import {Router} from "./router";
import * as _debug from "debug";
import * as favicon from "serve-favicon";
import "reflect-metadata";

export const express = Symbol("express-mvc");
export const router = Symbol("router");

const kernel = new Kernel();
const debug = _debug('express-mvc');

export function expressMvc(...controllers: any[]): ExpressMvcInterface {
    kernel.bind<ExpressMvcInterface>(express).to(ExpressMvc);
    kernel.bind<Router>(router).to(Router);
    debug("Bound Interface and Router");
    // Handle registering Controllers
    controllers.forEach(controller => {
        debug(`Binding controller (${GetControllerName(controller)})`);
        kernel.bind<mvcController>(GetControllerName(controller)).to(controller);
        debug(`Bound controller (${GetControllerName(controller)})`);
    });
    debug('Finished binding controllers...');
    return kernel.get<ExpressMvcInterface>(express);
}

@injectable()
class ExpressMvc implements ExpressMvcInterface {
    private running: boolean;
    private server: e.Express;

    constructor( @inject(router) private router: Router) {
        router.kernel = kernel;

        this.server = e();
        this.server.set('views', '../views');
        this.server.set('view engine', 'pug');
    }

    addTransient<T>(identifier: string, service: any): ExpressMvcInterface {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        kernel.bind<T>(identifier).to(service);
        return this;
    }

    addSingleton<T>(identifier: string, service: any): ExpressMvcInterface {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }

        kernel.bind<T>(identifier).to(service).inSingletonScope();
        return this;
    }

    setViewEngine(engine: string, directory: string): ExpressMvcInterface {
        if (this.running) {
            throw new Error("Set view engine before server is started.");
        }

        this.server.set('views', directory);
        this.server.set('view engine', engine);
        return this;
    }

    setFavicon(path: string): ExpressMvcInterface {
        this.server.use(favicon(path));
        return this;
    }

    addStatic(path: string): ExpressMvcInterface {
        this.server.use(e.static(path));
        return this;
    }

    listen(port?: number, host?: string) {
        port = port || 3000;
        
        // This will call the router which will be from inversify, for now fudge it
        this.server.all("/:one?/:two?/:three?/:four?/:five?/:six?/:seven?", (req, res) => {
            this.router.route(req, res);
        });

        this.server.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            this.running = true;
        })
    }
}

export interface ExpressMvcInterface {
    addSingleton<T>(identifier: string, service: any): ExpressMvcInterface;
    addTransient<T>(identifier: string, service: any): ExpressMvcInterface;
    setViewEngine(engine: string, directory: string): ExpressMvcInterface;
    setFavicon(path: string): ExpressMvcInterface;
    addStatic(path: string): ExpressMvcInterface;
    listen(port?: number, host?: string);
}