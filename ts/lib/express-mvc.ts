/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />

import * as e from "express";
import {Kernel, injectable, inject} from 'inversify';
import {mvcController} from './controllers/abstractController';
import {GetControllerName} from './decorators/controller';
import {Router} from "./router";
import "reflect-metadata";

export const express = Symbol("express-mvc");
export const router = Symbol("router");

const kernel = new Kernel();

export function expressMvc(...controllers: any[]): ExpressMvcInterface {
    // kernel = new Kernel();
    kernel.bind<ExpressMvcInterface>(express).to(ExpressMvc);
    kernel.bind<Router>(router).to(Router);
    // Handle registering Controllers
    controllers.forEach(controller => {
        kernel.bind<mvcController>(GetControllerName(controller)).to(controller);
    })
    return kernel.get<ExpressMvcInterface>(express);
}

@injectable()
class ExpressMvc implements ExpressMvcInterface {
    private started: boolean;
    private server: e.Express;

    constructor( @inject(router) private router: Router) {
        router.kernel = kernel;
    }

    addTransient() { }
    addSingleton() { }
    start() {
        // Define the express server
        this.server = e();
        // TODO will change this a options setting for production... but we are no where near that, if ever ;)
        this.server.set('views', '../views');
        this.server.set('view engine', 'pug');

        // This will call the router which will be from inversify, for now fudge it
        this.server.get("/:one?/:two?/:three?", (req, res) => {
            this.router.route(req, res);
        });

        this.server.listen(3000, () => {
            console.log("Listening on port 3000");
        })
    }
}

interface ExpressMvcInterface {
    addSingleton();
    addTransient();
    start();
}