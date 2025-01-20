"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
    passportPhoto: {
        type: String,
        required: true,
    },
    businessRegistrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    storeAddress: {
        country: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        postalCode: {
            type: String,
            required: true,
            trim: true,
        },
    },
    ownerGovernmentID: {
        type: String,
        required: true,
    },
    businessRegistrationCertificate: {
        type: String,
        required: true,
    },
    storefrontImage: {
        type: String,
    },
}, {
    timestamps: true,
});
const Store = (0, mongoose_1.model)('Store', storeSchema);
exports.default = Store;
//# sourceMappingURL=store.model.js.map