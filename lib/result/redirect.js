"use strict";
const result_1 = require("./result");
const controller_1 = require("../decorators/controller");
class RedirectResult extends result_1.Result {
    constructor(controller, method, options) {
        super();
        this.method = method;
        if (typeof controller === 'string') {
            this.controller = controller;
        }
        else {
            this.controller = controller_1.GetControllerName(controller);
        }
    }
    handle(res) {
        var url = "";
        if (this.controller === 'index') {
            url = "";
        }
        else {
            url = `/${this.controller}`;
        }
        if (this.method) {
            url = `${url}/${this.method}`;
        }
        console.log(url);
        if (url === "") {
            url = "/";
        }
        res.redirect(url);
    }
}
exports.RedirectResult = RedirectResult;
