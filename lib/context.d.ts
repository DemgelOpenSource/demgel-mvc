/// <reference types="express" />
import { Response, Request } from "express";
export declare class Context {
    request: Request;
    response: Response;
    extras: {
        [key: string]: any;
    };
    model?: Model;
    constructor(request: Request, response: Response);
    readonly method: string;
    readonly headers: {
        [key: string]: string;
    };
}
export interface Model {
    isValid: boolean;
    errors: {
        [key: string]: string;
    };
}
