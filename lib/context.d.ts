import { Response, Request } from "express";
export declare class Context {
    request: Request;
    response: Response;
    extras: {
        [key: string]: any;
    };
    constructor(request: Request, response: Response);
    method: string;
    headers: {
        [key: string]: string;
    };
}
export interface IContext {
    method: string;
    headers: {
        [key: string]: string;
    };
}
