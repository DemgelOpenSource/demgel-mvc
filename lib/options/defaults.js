"use strict";
const options_1 = require("./options");
/**
 * The default server options
 */
class DefaultOptions extends options_1.AOptions {
    constructor(...args) {
        super(...args);
        this.busboy = {
            allowUpload: false,
            uploadPath: "./uploads"
        };
        this.files = {
            basePath: "./files"
        };
        this.views = {
            path: '../views',
            engine: 'pug',
            engineImpl: undefined,
        };
        this.favicon = {
            path: undefined
        };
        this.staticFiles = {
            paths: new Array()
        };
        this.cookieOptions = {};
    }
}
exports.DefaultOptions = DefaultOptions;
