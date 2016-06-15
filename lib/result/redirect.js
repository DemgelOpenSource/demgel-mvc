"use strict";
const result_1 = require("./result");
const router_1 = require("../router");
class RedirectResult extends result_1.Result {
    constructor(controller, method, options) {
        super();
        this.method = method;
        if (typeof controller === 'string') {
            this.controller = controller + "/";
        }
        else {
            let cont = router_1.RouteBuilder.instance.getRoute(controller);
            if (cont.path === "/") {
                this.controller = cont.path;
            }
            else {
                this.controller = cont.path + "/";
            }
        }
    }
    handle(res) {
        var url = this.controller;
        if (this.method) {
            url = `${url}${this.method}`;
        }
        res.redirect(url);
    }
}
exports.RedirectResult = RedirectResult;
