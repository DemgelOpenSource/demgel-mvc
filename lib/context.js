"use strict";
class Context {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.extras = {};
    }
    get method() {
        return this.request.method;
    }
    get headers() {
        return this.request.headers;
    }
}
exports.Context = Context;
