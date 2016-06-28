import {Response} from 'express';

export abstract class Result {
    abstract handle(res: Response): void;
}