import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
export default class RequestValidator {
    static validate: <T extends object>(classInstance: ClassConstructor<T>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
