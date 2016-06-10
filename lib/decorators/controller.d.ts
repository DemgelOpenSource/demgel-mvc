import "reflect-metadata";
import { mvcController } from "../controllers/mvcController";
export declare const controllerName: Symbol;
/**
 * baseRoute if null will use the name of the controller lowercased (HelloController becomes hello)
 *
 * It is not required but if Controller is at the end, it will be removed for the route name
 */
export declare function Controller(options: {
    baseRoute?: string;
    index?: boolean;
}): (target: any) => void;
export declare function GetControllerName(target: any): string;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export declare function HttpGet(route?: string | boolean): (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export declare function HttpPost(route?: string | boolean): (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export declare function HttpDelete(route?: string | boolean): (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * route is optional, if not supplied will use a pascal case of the function name as route
 */
export declare function HttpPut(route?: string | boolean): (target: mvcController, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
