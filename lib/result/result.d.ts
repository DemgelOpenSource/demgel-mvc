import { Response } from 'express';
export declare abstract class Result {
    abstract handle(res: Response): any;
}
