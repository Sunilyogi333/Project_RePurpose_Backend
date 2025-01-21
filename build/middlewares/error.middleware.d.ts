import { NextFunction, Request, Response } from 'express';
declare const errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default errorHandler;
