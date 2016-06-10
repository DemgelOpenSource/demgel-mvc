"use strict";
const result_1 = require("./result");
class ErrorResult extends result_1.Result {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    handle(res) {
        res.render(`Errors/${this.status}`, { message: this.message }, (err, html) => {
            if (err) {
                res.status(this.status).send(this.message);
            }
            else {
                res.status(this.status).send(html);
            }
        });
    }
}
exports.ErrorResult = ErrorResult;
