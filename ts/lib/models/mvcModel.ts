export abstract class mvcModel {
    errors: Map<string, string> = new Map<string, string>();
    isValid(): boolean {
        return !(this.errors.size > 0);
    }
}