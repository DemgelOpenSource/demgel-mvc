"use strict";
class mvcModel {
    constructor() {
        this.errors = new Map();
    }
    isValid() {
        return !(this.errors.size > 0);
    }
    toJSON() {
        let i = {};
        for (let prop in this) {
            if (typeof this[prop] !== "function") {
                console.log(typeof this[prop]);
                i[prop] = this[prop];
            }
        }
        return i;
    }
}
exports.mvcModel = mvcModel;
