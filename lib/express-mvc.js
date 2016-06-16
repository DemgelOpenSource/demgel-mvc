"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const e = require("express");
const express_busboy_1 = require("express-busboy");
const inversify_1 = require('inversify');
const router_1 = require("./router");
const _debug = require("debug");
const favicon = require("serve-favicon");
require("reflect-metadata");
const context_1 = require("./context");
const defaults_1 = require("./options/defaults");
(function (AllowedMethods) {
    AllowedMethods[AllowedMethods["GET"] = 0] = "GET";
    AllowedMethods[AllowedMethods["POST"] = 1] = "POST";
    AllowedMethods[AllowedMethods["PUT"] = 2] = "PUT";
    AllowedMethods[AllowedMethods["DELETE"] = 3] = "DELETE";
})(exports.AllowedMethods || (exports.AllowedMethods = {}));
var AllowedMethods = exports.AllowedMethods;
const debug = _debug('expressify:express-mvc');
let ExpressMvc = class ExpressMvc {
    constructor(routerBuilder, defaults) {
        this.routerBuilder = routerBuilder;
        this.defaults = defaults;
        this.busboy = {
            allowUpload: false,
            uploadPath: "./uploads"
        };
        this.server = e();
        this.server.use((req, res, next) => {
            debug("adding context");
            req.context = new context_1.Context(req, res);
            next();
        });
    }
    /**
     * Add a Transient service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} service The service to add to the DI
     * @return {ExpressMvc}
     */
    addTransient(identifier, service) {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }
        this.kernel.bind(identifier).to(service);
        return this;
    }
    /**
     * Add a Singleton service to DI
     *
     * @param {string | Symbol | INewable<T>} identifier The class/string/Symbol used to identify this Service
     * @param {any} service The service to add to the DI
     * @return {ExpressMvc}
     */
    addSingleton(identifier, service) {
        if (this.running) {
            throw new Error("Add services before starting server.");
        }
        this.kernel.bind(identifier).to(service).inSingletonScope();
        return this;
    }
    /**
     * An IOptions object to add to the DI, usually used by services for configuration
     *
     * @param {string | Symbol | INewable<T>} identifier The string/Symbol/class to identify this object in the DI
     * @return {ExpressMvc}
     */
    addOptions(identifier, constantObj) {
        this.kernel.bind(identifier).toConstantValue(constantObj);
        return this;
    }
    /**
     * Should uploads be allowed
     *
     * @param {string} path The path the files should be saved too.
     * @return {ExpressMvc}
     */
    allowUpload(path) {
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
    setViewEngine(directory, engine) {
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
    setFavicon(path) {
        this.defaults.favicon.path = path;
        return this;
    }
    /**
     * Adds a directory to serve static files from
     *
     * @param {string} path The directory to serve static files from, defaults to ./public
     * @return {ExpressMvc}
     */
    addStaticFilesPath(path) {
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
    listen(port, host) {
        port = port || 3000;
        // Busboy Setup        
        express_busboy_1.extend(this.server, this.defaults.busboy);
        if (this.defaults.busboy.allowUpload) {
            console.log(`Files will be uploaded to ${this.busboy.uploadPath}.`);
        }
        else {
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
        });
        return this;
    }
};
ExpressMvc = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(router_1.RouteBuilder)),
    __param(1, inversify_1.inject(defaults_1.DefaultOptions)), 
    __metadata('design:paramtypes', [router_1.RouteBuilder, defaults_1.DefaultOptions])
], ExpressMvc);
exports.ExpressMvc = ExpressMvc;
