import {Response, Request} from "express";

export class Context {
    extras: { [key: string]: any } = {};
    model?: Model;

    constructor(public request: Request, public response: Response) {

    }

    get method(): string {
        return this.request.method;
    }

    get headers(): {[key: string]: string} {
        return this.request.headers;
    }
}

export interface Model {
    isValid: boolean;
    errors: { [key: string]: string };
}