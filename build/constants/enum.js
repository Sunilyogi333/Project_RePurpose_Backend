"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_STATUS = exports.PACKAGE_STATUS = exports.SELLER_STATUS = exports.Gender = exports.ROLE = exports.Environment = void 0;
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "DEVELOPMENT";
    Environment["PRODUCTION"] = "PRODUCTION";
})(Environment || (exports.Environment = Environment = {}));
var ROLE;
(function (ROLE) {
    ROLE["ADMIN"] = "ADMIN";
    ROLE["MEMBER"] = "MEMBER";
    ROLE["SELLER"] = "SELLER";
})(ROLE || (exports.ROLE = ROLE = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHERS"] = "OTHERS";
})(Gender || (exports.Gender = Gender = {}));
var SELLER_STATUS;
(function (SELLER_STATUS) {
    SELLER_STATUS["WAITING_APPROVAL"] = "WAITING_APPROVAL";
    SELLER_STATUS["APPROVED"] = "APPROVED";
    SELLER_STATUS["REJECTED"] = "REJECTED";
})(SELLER_STATUS || (exports.SELLER_STATUS = SELLER_STATUS = {}));
var PACKAGE_STATUS;
(function (PACKAGE_STATUS) {
    PACKAGE_STATUS["WAITING_APPROVAL"] = "WAITING_APPROVAL";
    PACKAGE_STATUS["CANCELLED"] = "CANCELLED";
    PACKAGE_STATUS["APPROVED"] = "APPROVED";
    PACKAGE_STATUS["REJECTED"] = "REJECTED";
})(PACKAGE_STATUS || (exports.PACKAGE_STATUS = PACKAGE_STATUS = {}));
var PRODUCT_STATUS;
(function (PRODUCT_STATUS) {
    PRODUCT_STATUS["AVAILABLE"] = "AVAILABLE";
    PRODUCT_STATUS["ORDERED"] = "ORDERED";
    PRODUCT_STATUS["SOLD"] = "SOLD";
    PRODUCT_STATUS["DONATED"] = "DONATED";
})(PRODUCT_STATUS || (exports.PRODUCT_STATUS = PRODUCT_STATUS = {}));
//# sourceMappingURL=enum.js.map