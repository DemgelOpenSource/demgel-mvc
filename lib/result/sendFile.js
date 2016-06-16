"use strict";
const result_1 = require("./result");
class SendFileResult extends result_1.Result {
    constructor(path) {
        super();
        this.path = path;
    }
    handle(res) {
        res.sendFile(this.path);
    }
}
exports.SendFileResult = SendFileResult;
