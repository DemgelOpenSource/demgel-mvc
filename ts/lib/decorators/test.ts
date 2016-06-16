export function test() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        console.log("This will eventually be something that intigrates with unit testing...");
    }
}