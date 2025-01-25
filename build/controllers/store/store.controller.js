"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const tsyringe_1 = require("tsyringe");
const store_model_1 = __importDefault(require("../../models/store.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const statusCodes_1 = require("../../constants/statusCodes");
const response_1 = require("../../utils/response");
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
const cloudinary_service_1 = __importDefault(require("../../services/cloudinary.service"));
const enum_1 = require("../../constants/enum");
const email_service_1 = __importDefault(require("../../services/email.service"));
let StoreController = class StoreController {
    createStoreKYC(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeName, ownerName, email, phoneNumber, storeAddress, storeNumber, businessRegNumber } = req.body;
            const userID = req.user._id;
            const files = req.files;
            try {
                if (!files.passportPhoto || !files.businessRegCertificate || !files.storeFrontImage) {
                    throw HttpException_1.default.BadRequest('All KYC images are required.');
                }
                const uploadedImages = yield Promise.all([
                    cloudinary_service_1.default.uploadImage(files.passportPhoto[0].path),
                    cloudinary_service_1.default.uploadImage(files.businessRegCertificate[0].path),
                    cloudinary_service_1.default.uploadImage(files.storeFrontImage[0].path),
                ]);
                if (uploadedImages.some((result) => !result)) {
                    throw HttpException_1.default.InternalServer('Failed to upload one or more images.');
                }
                const [passportPhotoURL, businessRegCertificateURL, storeFrontImageURL] = uploadedImages.map((result) => result.secure_url);
                const existingStore = yield store_model_1.default.findOne({ userID });
                if (existingStore) {
                    throw HttpException_1.default.Conflict('User already has a store.');
                }
                const storeData = {
                    userID,
                    storeName,
                    ownerName,
                    email,
                    phoneNumber,
                    storeAddress,
                    storeNumber,
                    businessRegNumber,
                    passportPhoto: passportPhotoURL,
                    businessRegCertificate: businessRegCertificateURL,
                    storeFrontImage: storeFrontImageURL,
                };
                const newStore = yield store_model_1.default.create(storeData);
                const updatedUser = yield user_model_1.default.findByIdAndUpdate(userID, { storeStatus: enum_1.SELLER_KYC_STATUS.PENDING }, { new: true });
                if (!updatedUser) {
                    throw HttpException_1.default.NotFound('User not found.');
                }
                res
                    .status(statusCodes_1.StatusCodes.CREATED)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.CREATED, 'Store KYC created successfully', newStore));
            }
            catch (error) {
                console.error('Error in createStoreKYC:', error);
                throw error instanceof HttpException_1.default ? error : HttpException_1.default.InternalServer('Failed to create store KYC');
            }
        });
    }
    getMyStoreKYC(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            try {
                const kycForm = yield store_model_1.default.findOne({ userID: userId });
                console.log('kyc form here', kycForm);
                if (!kycForm) {
                    throw HttpException_1.default.NotFound('No KYC form found for this user.');
                }
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'KYC form retrieved successfully', kycForm));
            }
            catch (error) {
                console.error('Error in getUserKYC:', error);
                throw error instanceof HttpException_1.default ? error : HttpException_1.default.InternalServer('Failed to retrieve KYC form');
            }
        });
    }
    getPendingStores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pendingStores = yield store_model_1.default.find({ status: 'pending' });
                if (!pendingStores.length) {
                    res
                        .status(statusCodes_1.StatusCodes.NOT_FOUND)
                        .json((0, response_1.createResponse)(false, statusCodes_1.StatusCodes.NOT_FOUND, 'No pending stores found', []));
                    return;
                }
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Pending stores fetched successfully', pendingStores));
            }
            catch (error) {
                console.error('Error fetching pending stores:', error);
                throw HttpException_1.default.InternalServer('Failed to fetch pending stores');
            }
        });
    }
    getStores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield store_model_1.default.find();
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Stores fetched successfully', stores));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to fetch stores');
            }
        });
    }
    approveStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            try {
                const store = yield store_model_1.default.findById(storeId);
                if (!store) {
                    throw HttpException_1.default.NotFound('Store not found');
                }
                yield user_model_1.default.findByIdAndUpdate(store.userID, { storeStatus: enum_1.SELLER_KYC_STATUS.APPROVED });
                store.status = enum_1.SELLER_KYC_STATUS.APPROVED;
                yield store.save();
                const emailContent = `<p>Dear ${store.storeName},</p>
    <p>Congratulations! Your store has been approved and is now live on our platform.</p>
    <p>You can start managing your store and adding products.</p>`;
                yield (0, email_service_1.default)(store.email, 'Store Approval Notification', emailContent);
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store status updated to pending successfully'));
            }
            catch (error) {
                console.error('Error approving store:', error);
                throw HttpException_1.default.InternalServer('Failed to approve store');
            }
        });
    }
    rejectStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            try {
                const store = yield store_model_1.default.findByIdAndDelete(storeId);
                if (!store) {
                    throw HttpException_1.default.NotFound('Store not found');
                }
                const emailContent = `<p>Dear ${store.storeName},</p>
    <p>We regret to inform you that your store has been rejected and removed from our platform.</p>
    <p>If you have any questions or wish to appeal, please contact our support team.</p>`;
                yield (0, email_service_1.default)(store.email, 'Store Rejection Notification', emailContent);
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store rejected and deleted successfully'));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to reject store');
            }
        });
    }
    requestModificationStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = req.params;
                console.log("req.body", req.body);
                const { modificationReason } = req.body;
                console.log('modification reason', modificationReason);
                const store = yield store_model_1.default.findById(storeId);
                if (!store) {
                    throw HttpException_1.default.NotFound('Store not found');
                }
                yield user_model_1.default.findByIdAndUpdate(store.userID, { storeStatus: enum_1.SELLER_KYC_STATUS.PENDING });
                store.status = enum_1.SELLER_KYC_STATUS.PENDING;
                store.updatedAt = new Date();
                yield store.save();
                const emailContent = `<p>Dear ${store.storeName},</p>
    <p>Your store requires modifications before it can be approved.</p>
    <p>Reason: ${modificationReason}</p>
    <p>Please make the necessary changes and resubmit your application.</p>`;
                yield (0, email_service_1.default)(store.email, 'Store Modification Request', emailContent);
                res.status(200).json({
                    message: 'Store status updated to pending successfully',
                    store,
                });
            }
            catch (error) {
                console.error('Error updating store status to pending:', error);
                res.status(500).json({ message: 'An error occurred while updating the store status' });
            }
        });
    }
    updateStoreKYC(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const updateFields = req.body;
            const files = req.files;
            try {
                const store = yield store_model_1.default.findById(storeId);
                if (!store) {
                    throw HttpException_1.default.NotFound('Store not found.');
                }
                if (files.passportPhoto) {
                    const passportPhotoResult = yield cloudinary_service_1.default.uploadImage(files.passportPhoto[0].path);
                    if (!passportPhotoResult) {
                        throw HttpException_1.default.InternalServer('Failed to upload passport photo.');
                    }
                    updateFields.passportPhoto = passportPhotoResult.secure_url;
                }
                if (files.businessRegCertificate) {
                    const businessRegCertificateResult = yield cloudinary_service_1.default.uploadImage(files.businessRegCertificate[0].path);
                    if (!businessRegCertificateResult) {
                        throw HttpException_1.default.InternalServer('Failed to upload business registration certificate.');
                    }
                    updateFields.businessRegCertificate = businessRegCertificateResult.secure_url;
                }
                if (files.storeFrontImage) {
                    const storeFrontImageResult = yield cloudinary_service_1.default.uploadImage(files.storeFrontImage[0].path);
                    if (!storeFrontImageResult) {
                        throw HttpException_1.default.InternalServer('Failed to upload store front image.');
                    }
                    updateFields.storeFrontImage = storeFrontImageResult.secure_url;
                }
                const updatedStore = yield store_model_1.default.findByIdAndUpdate(storeId, { $set: updateFields }, { new: true, runValidators: true });
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store KYC updated successfully', updatedStore));
            }
            catch (error) {
                console.error('Error in updateStoreKYC:', error);
                throw error instanceof HttpException_1.default ? error : HttpException_1.default.InternalServer('Failed to update store KYC');
            }
        });
    }
    getStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            try {
                const store = yield store_model_1.default.findById(storeId);
                if (!store) {
                    throw HttpException_1.default.NotFound('Store not found');
                }
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store fetched successfully', store));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to fetch store');
            }
        });
    }
};
exports.StoreController = StoreController;
exports.StoreController = StoreController = __decorate([
    (0, tsyringe_1.injectable)()
], StoreController);
//# sourceMappingURL=store.controller.js.map