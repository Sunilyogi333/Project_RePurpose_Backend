"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQueryParams = addQueryParams;
const url_1 = require("url");
function addQueryParams(baseUrl, params) {
    const url = new url_1.URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    return url.toString();
}
//# sourceMappingURL=addQueryParams.utils.js.map