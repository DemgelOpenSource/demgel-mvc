import {kernel} from "../express-mvc";

export function test() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        console.log(kernel);
    }
}