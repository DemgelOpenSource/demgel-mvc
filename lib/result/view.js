"use strict";
const result_1 = require("./result");
class View extends result_1.Result {
    constructor(controller, view, viewOptions) {
        super();
        this.view = view;
        this.viewOptions = viewOptions;
        if (typeof controller === 'string') {
            this.controller = controller;
        }
        else {
            this.controller = controller.constructor.name;
        }
    }
    handle(res) {
        res.render(`${this.controller}/${this.view}`, this.viewOptions || {}, (err, html) => {
            if (err) {
                res.status(500).send("Error Message");
            }
            else {
                res.status(200).send(html);
            }
        });
    }
}
exports.View = View;
