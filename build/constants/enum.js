"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_TYPE = exports.PRODUCT_STATUS = exports.PACKAGE_STATUS = exports.SELLER_KYC_STATUS = exports.Gender = exports.ROLE = exports.Environment = void 0;
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "DEVELOPMENT";
    Environment["PRODUCTION"] = "PRODUCTION";
})(Environment || (exports.Environment = Environment = {}));
var ROLE;
(function (ROLE) {
    ROLE["ADMIN"] = "admin";
    ROLE["MEMBER"] = "member";
    ROLE["SELLER"] = "seller";
    ROLE["STORE"] = "store";
})(ROLE || (exports.ROLE = ROLE = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHERS"] = "OTHERS";
})(Gender || (exports.Gender = Gender = {}));
var SELLER_KYC_STATUS;
(function (SELLER_KYC_STATUS) {
    SELLER_KYC_STATUS["PENDING"] = "pending";
    SELLER_KYC_STATUS["APPROVED"] = "approved";
    SELLER_KYC_STATUS["REJECTED"] = "rejected";
})(SELLER_KYC_STATUS || (exports.SELLER_KYC_STATUS = SELLER_KYC_STATUS = {}));
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
var NOTIFICATION_TYPE;
(function (NOTIFICATION_TYPE) {
    NOTIFICATION_TYPE["PROMOTIONAL"] = "Promotional";
    NOTIFICATION_TYPE["SYSTEM_ALERT"] = "System Alert";
    NOTIFICATION_TYPE["PRODUCT_UPDATE"] = "Product Update";
    NOTIFICATION_TYPE["ORDER_STATUS"] = "Order Status";
})(NOTIFICATION_TYPE || (exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE = {}));
//# sourceMappingURL=enum.js.map