declare module 'express-busboy' {
    function extend(app: Express.Application, option?: {
        path?: string,
        upload?: boolean
    }): any;
}