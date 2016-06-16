import {kernel} from "../setup";

export function test() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        console.log(kernel);
    }
}