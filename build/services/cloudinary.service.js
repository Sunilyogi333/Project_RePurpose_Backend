"use strict";
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
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const fs_1 = __importDefault(require("fs"));
class CloudinaryService {
    uploadImage(localFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!localFilePath) {
                    console.log('Local path is missing');
                    return null;
                }
                const response = yield cloudinary_config_1.default.uploader.upload(localFilePath, {
                    folder: 'child-thrift-store',
                    resource_type: 'auto',
                });
                console.log('File uploaded to Cloudinary successfully', response.url);
                fs_1.default.unlinkSync(localFilePath);
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log('Error uploading file to Cloudinary', error.message);
                }
                else {
                    console.log('An unknown error occurred', error);
                }
                fs_1.default.unlinkSync(localFilePath);
                return null;
            }
        });
    }
    deleteImage(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publicId = this.extractPublicIdFromUrl(imageUrl);
                const result = yield cloudinary_config_1.default.uploader.destroy(`child-thrift-store/${publicId}`);
                if (result.result === 'ok') {
                    console.log('Image deleted from Cloudinary:', publicId);
                    return true;
                }
                else {
                    console.error('Failed to delete image:', publicId);
                    return false;
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error deleting image from Cloudinary:', error.message);
                }
                else {
                    console.error('An unknown error occurred');
                }
                return false;
            }
        });
    }
    extractPublicIdFromUrl(imageUrl) {
        const parts = imageUrl.split('/');
        const publicIdWithExtension = parts[parts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        return publicId;
    }
}
exports.default = new CloudinaryService();
//# sourceMappingURL=cloudinary.service.js.map