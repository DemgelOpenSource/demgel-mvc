import { Response, Request } from "express";
export declare class Context {
    request: Request;
    response: Response;
    constructor(request: Request, response: Response);
    method: string;
    headers: {
        [key: string]: string;
    };
}
