import { AOptions } from "./options";
/**
 * The default server options
 */
export declare class DefaultOptions extends AOptions {
    busboy: {
        allowUpload: boolean;
        uploadPath: string;
    };
    files: {
        basePath: string;
    };
    views: {
        path: string;
        engine: string;
        engineImpl: any;
    };
    favicon: {
        path: any;
    };
    staticFiles: {
        paths: string[];
    };
}
