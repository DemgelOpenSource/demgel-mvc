/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpGet(options?: MethodOptions): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpPost(options?: MethodOptions): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpDelete(options?: MethodOptions): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a slug-case case of the function name as route
 */
export declare function HttpPut(options?: MethodOptions): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export interface MethodOptions {
    route?: string | undefined;
    parameters?: string | undefined;
}
