declare class HttpException extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
    static NotFound(message: string): HttpException;
    static BadRequest(message: string): HttpException;
    static Conflict(message: string): HttpException;
    static MethodNotAllowed(message: string): HttpException;
    static Unauthorized(message: string): HttpException;
    static Forbidden(message: string): HttpException;
    static InternalServer(message: string): HttpException;
}
export default HttpException;
