"use strict";
const result_1 = require("./result");
//import {GetControllerName} from "../decorators/controller";
class RedirectResult extends result_1.Result {
    constructor(controller, method, options) {
        super();
        this.method = method;
        //if (typeof controller === 'string') {
        this.controller = controller;
        //} else {
        //    this.controller = GetControllerName(controller) || "";
        //}
    }
    handle(res) {
        var url = `${this.controller}/`;
        if (this.method) {
            url = `${url}${this.method}`;
        }
        res.redirect(url);
    }
}
exports.RedirectResult = RedirectResult;
