import {AOptions} from "./options";
import * as cookies from "cookie-parser";

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

    views: ViewOptions = {
        path: '../views',
        engine: 'pug',
        engineImpl: undefined,
    };

    favicon: FaviconOptions = {
        path: undefined
    };

    staticFiles = {
        paths: new Array<string>()
    }

    cookieOptions = {
        
    }
}

export interface ViewOptions {
    path: string;
    engine: string;
    engineImpl: any | undefined;
}

export interface FaviconOptions {
    path: string | undefined;
}
