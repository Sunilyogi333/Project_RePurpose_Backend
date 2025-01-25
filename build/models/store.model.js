"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../constants/enum");
const storeSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    storeName: {
        type: String,
        required: true,
        maxlength: 255,
        trim: true,
    },
    ownerName: {
        type: String,
        required: true,
        maxlength: 255,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 15,
        trim: true,
    },
    storeNumber: {
        type: String,
        required: true,
        maxlength: 40,
        trim: true,
    },
    status: {
        type: String,
        enum: [enum_1.SELLER_KYC_STATUS.APPROVED, enum_1.SELLER_KYC_STATUS.REJECTED, enum_1.SELLER_KYC_STATUS.PENDING],
        default: enum_1.SELLER_KYC_STATUS.PENDING,
    },
    storeAddress: {
        type: String,
        required: true,
        unique: true,
    },
    businessRegNumber: {
        type: String,
        required: true,
        trim: true,
        sparse: true,
    },
    passportPhoto: {
        type: String,
        required: true,
    },
    businessRegCertificate: {
        type: String,
        required: true,
    },
    storeFrontImage: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
});
const Store = (0, mongoose_1.model)('Store', storeSchema);
exports.default = Store;
//# sourceMappingURL=store.model.js.map