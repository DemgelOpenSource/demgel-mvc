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
    views: ViewOptions;
    favicon: FaviconOptions;
    staticFiles: {
        paths: string[];
    };
    cookieOptions: {};
}
export interface ViewOptions {
    path: string;
    engine: string;
    engineImpl: any | undefined;
}
export interface FaviconOptions {
    path: string | undefined;
}
