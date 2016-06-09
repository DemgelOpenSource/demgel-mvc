"use strict";
const result_1 = require("./result");
class JsonResult extends result_1.Result {
    constructor(obj) {
        super();
        this.object = JSON.stringify(obj);
    }
    handle(res) {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(this.object);
    }
}
exports.JsonResult = JsonResult;
