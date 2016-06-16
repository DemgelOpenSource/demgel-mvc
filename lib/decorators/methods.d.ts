/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpGet(options?: {
    route?: string;
    parameters?: string;
}): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpPost(options?: {
    route?: string;
    parameters?: string;
}): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
