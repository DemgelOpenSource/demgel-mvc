import {AOptions} from "./options";

/**
 * The default server options
 */
export class DefaultOptions extends AOptions {
    busboy = {
        allowUpload: false,
        uploadPath: "./uploads"
    };

    files = {
        basePath: "./files"
    }

    views = {
        path: '../views',
        engine: 'pug'
    };

    favicon = {
        path: undefined
    };

    staticFiles = {
        paths: new Array<string>()
    }
}