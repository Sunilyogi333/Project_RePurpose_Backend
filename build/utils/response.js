"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnResponse = void 0;
exports.createResponse = createResponse;
class ReturnResponse {
    constructor(success, code, message, data, list, total, page, perPage, totalPages) {
        this.data = data;
        this.list = list;
        this.success = success;
        this.code = code;
        this.message = message;
        this.total = total;
        this.page = page;
        this.perPage = perPage;
        this.totalPages = totalPages;
    }
}
exports.ReturnResponse = ReturnResponse;
function createResponse(success, code, message, data, list, total, page, perPage, totalPages) {
    return new ReturnResponse(success, code, message, data, list, total, page, perPage, totalPages);
}
//# sourceMappingURL=response.js.map