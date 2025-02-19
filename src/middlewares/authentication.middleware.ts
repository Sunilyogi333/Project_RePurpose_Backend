import { NextFunction, Request, Response } from 'express';
import {EnvironmentConfiguration} from '../config/env.config';
import { ROLE } from '../constants/enum';
import { Message } from '../constants/message';
import { UserService }  from '../services/user/user.service';
import HttpException from '../utils/HttpException';
import { WebToken } from '../utils/webToken.utils';

const authentication = (allowedRoles?: ROLE | ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    // console.log('Authorization:', authorization);

    if (!authorization) {
      return next(HttpException.NotFound('Authorization token not found'));
    }

    const [mode, token] = authorization.trim().split(' ');

    if (!token || mode !== 'Bearer') {
      return next(HttpException.BadRequest('Invalid token format'));
    }

    try {
      // Verify the token
      const decodedToken = new WebToken().verify(token, EnvironmentConfiguration.ACCESS_TOKEN_SECRET);
      if (!decodedToken) {
        return next(HttpException.Unauthorized(Message.tokenExpire));
      }

      const { id, role } = decodedToken;

      // Check if the user's role is allowed
      if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
        return next(HttpException.Unauthorized(Message.NOT_AUTHORIZED_MESSAGE));
      }

      // Fetch user from the database
      const user = await new UserService().findUserById(id);
      if (!user) {
        return next(HttpException.Unauthorized('User not found or unauthorized'));
      }

      // Attach user to request object
      req.user = user;

      return next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return next(HttpException.Unauthorized('Your token has expired. Please login again.'));
      }

      console.error('Authentication Middleware Error:', err);
      return next(HttpException.InternalServer('An error occurred during authentication'));
    }
  };
};

export default authentication;
