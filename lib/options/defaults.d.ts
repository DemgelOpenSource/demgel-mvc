import { AOptions } from "./options";
/**
 * The default server options
 */
export declare class DefaultOptions extends AOptions {
    busboy: {
        allowUpload: boolean;
        uploadPath: string;
    };
    views: {
        path: string;
        engine: string;
    };
    favicon: {
        path: any;
    };
    staticFiles: {
        paths: string[];
    };
}
