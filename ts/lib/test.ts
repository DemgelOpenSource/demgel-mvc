import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class Test {
    var = "test";
}

export enum Testing {
    BLAH
}

export interface TestingI {
    test: string;
}