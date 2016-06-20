export abstract class mvcModel {
    errors: Map<string, string> = new Map<string, string>();
    isValid(): boolean {
        return !(this.errors.size > 0);
    }
    toJSON() {
        let i:any = {};
        for (let prop in this) {
            if (typeof this[prop] !== "function") {
                console.log(typeof this[prop]);
                i[prop] = this[prop];
            }
        }
        return i;
    }
}