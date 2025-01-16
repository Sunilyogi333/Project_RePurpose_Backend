import { StatusCodes } from "../constants/statusCodes";

class HttpException extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message); // Call the parent Error constructor
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational error by default

    // Customize the error stack trace to exclude the constructor itself
    Error.captureStackTrace(this, this.constructor);
  }

  // Static methods for common error types
  static NotFound(message: string) {
    return new HttpException(message, StatusCodes.NOT_FOUND);
  }
  static BadRequest(message: string) {
    return new HttpException(message, StatusCodes.BAD_REQUEST);
  }
  static Conflict(message: string) {
    return new HttpException(message, StatusCodes.CONFLICT);
  }
  static MethodNotAllowed(message: string) {
    return new HttpException(message, StatusCodes.METHOD_NOT_ALLOWED);
  }
  static Unauthorized(message: string) {
    return new HttpException(message, StatusCodes.UNAUTHORIZED);
  }

  static Forbidden(message: string) {
    return new HttpException(message, StatusCodes.FORBIDDEN);
  }

  static InternalServer(message: string) {
    return new HttpException(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export default HttpException
