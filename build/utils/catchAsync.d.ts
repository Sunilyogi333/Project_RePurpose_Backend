import { NextFunction, Request, Response } from 'express';
export declare const catchAsync: (fn: any) => (req: Request, res: Response, next: NextFunction) => any;
