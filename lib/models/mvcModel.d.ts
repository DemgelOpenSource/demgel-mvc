/// <reference types="lodash" />
export declare abstract class mvcModel {
    errors: Map<string, string>;
    isValid(): boolean;
    toJSON(): any;
}
