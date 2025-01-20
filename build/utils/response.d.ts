export declare class ReturnResponse<T> {
    data?: T | T[];
    list?: T[];
    success: boolean;
    code: number;
    message: string;
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
    constructor(success: boolean, code: number, message: string, data?: T | T[], list?: T[], total?: number, page?: number, perPage?: number, totalPages?: number);
}
export declare function createResponse<T>(success: boolean, code: number, message: string, data?: T, list?: T[], total?: number, page?: number, perPage?: number, totalPages?: number): ReturnResponse<T>;
