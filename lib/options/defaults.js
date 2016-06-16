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
        this.views = {
            path: '../views',
            engine: 'pug'
        };
        this.favicon = {
            path: undefined
        };
        this.staticFiles = {
            paths: new Array()
        };
    }
}
exports.DefaultOptions = DefaultOptions;
