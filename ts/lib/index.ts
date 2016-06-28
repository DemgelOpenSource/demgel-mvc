import {Context} from "./context";
import {Request} from "express";

export * from './express-mvc';
export * from './result/results';
export * from "./context";
export * from './controllers/controller';
export * from "./decorators/decorators";
export {Context} from "./context";
export * from "./router";
export * from "./options/defaults";
export * from "./options/options";
export * from "./services/service";
export * from "./setup";

declare module "express" {
    interface Request {
        context?: Context;
    }
}