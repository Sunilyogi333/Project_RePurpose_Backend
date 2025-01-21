"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("../constants/statusCodes");
class HttpException extends Error {
    constructor(message, statusCode = statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
    static NotFound(message) {
        return new HttpException(message, statusCodes_1.StatusCodes.NOT_FOUND);
    }
    static BadRequest(message) {
        return new HttpException(message, statusCodes_1.StatusCodes.BAD_REQUEST);
    }
    static Conflict(message) {
        return new HttpException(message, statusCodes_1.StatusCodes.CONFLICT);
    }
    static MethodNotAllowed(message) {
        return new HttpException(message, statusCodes_1.StatusCodes.METHOD_NOT_ALLOWED);
    }
    static Unauthorized(message) {
        return new HttpException(message, statusCodes_1.StatusCodes.UNAUTHORIZED);
    }
    static Forbidden(message) {
        return new HttpException(message, statusCodes_1.StatusCodes.FORBIDDEN);
    }
    static InternalServer(message) {
        return new HttpException(message, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.default = HttpException;
//# sourceMappingURL=HttpException.js.map