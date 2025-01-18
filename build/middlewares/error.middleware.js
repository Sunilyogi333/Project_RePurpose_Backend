"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("../config/env.config");
const enum_1 = require("../constants/enum");
const message_1 = require("../constants/message");
const errorHandler = (error, req, res, next) => {
    console.debug('Error Handler');
    console.error(error);
    const statusCode = error.isOperational ? error.statusCode : 500;
    const data = Object.assign({ success: false, message: error.isOperational ? error.message : message_1.Message.server, data: [] }, (env_config_1.EnvironmentConfiguration.NODE_ENV === enum_1.Environment.DEVELOPMENT && { originalError: error.message }));
    return res.status(statusCode).json(data);
};
exports.default = errorHandler;
//# sourceMappingURL=error.middleware.js.map