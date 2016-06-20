export declare function generateValidator(name: string, validator: any): (target: Object, propertyKey: string) => void;
export declare var testFailValidator: (target: Object, propertyKey: string) => void;
export declare var testSuccessValidator: (options: any) => (target: Object, propertyKey: string) => void;
export declare var isNumber: (target: Object, propertyKey: string) => void;
