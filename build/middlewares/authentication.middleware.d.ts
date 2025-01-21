import { NextFunction, Request, Response } from 'express';
import { ROLE } from '../constants/enum';
declare const authentication: (allowedRoles?: ROLE | ROLE[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authentication;
