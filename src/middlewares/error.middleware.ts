import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { EnvironmentConfiguration } from "../config/env.config";
import { Environment } from "../constants/enum";
import { Message } from "../constants/message";

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.debug('Error Handler');
    console.error(error); 

    const statusCode = error.isOperational ? error.statusCode : 500;

    const data = {
        success: false,
        message: error.isOperational ? error.message : Message.server,
        data: [],
        ...(EnvironmentConfiguration.NODE_ENV === Environment.DEVELOPMENT && { originalError: error.message })
    };

    return res.status(statusCode).json(data);
};

export default errorHandler;
