"use strict";
class mvcModel {
    constructor() {
        this.errors = new Map();
    }
    isValid() {
        return !(this.errors.size > 0);
    }
}
exports.mvcModel = mvcModel;
