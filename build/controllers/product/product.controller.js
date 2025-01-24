"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.ProductController = void 0;
const product_service_1 = require("../../services/product/product.service");
const user_model_1 = __importDefault(require("../../models/user.model"));
const response_1 = require("../../utils/response");
const statusCodes_1 = require("../../constants/statusCodes");
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
const tsyringe_1 = require("tsyringe");
const cloudinary_service_1 = __importDefault(require("../../services/cloudinary.service"));
const python_shell_1 = require("python-shell");
const server_1 = require("../../server");
const server_2 = require("../../server");
let ProductController = class ProductController {
    constructor(productService) {
        this.getRewardPoint = (inputData) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                python_shell_1.PythonShell.run('AI_MODEL/rewardPoint.py', {
                    args: [JSON.stringify(inputData)],
                    pythonOptions: ['-u'],
                })
                    .then((messages) => {
                    const response = JSON.parse(messages[1]);
                    resolve(response);
                })
                    .catch((error) => {
                    console.error('Error in Python script:', error);
                    reject('Failed to retrieve data from Python script');
                });
            });
        });
        this.productService = productService;
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, category, partName, materialName, ecoFriendly } = req.body;
            const seller = req.user._id;
            const ecoFriendlyBoolean = ecoFriendly === 'Yes';
            const images = req.files;
            try {
                const uploadedImages = yield Promise.all(images.map((file) => __awaiter(this, void 0, void 0, function* () {
                    console.log('file path', file.path);
                    const result = yield cloudinary_service_1.default.uploadImage(file.path);
                    if (result) {
                        console.log('success of this image', result.secure_url);
                        return result.secure_url;
                    }
                    else {
                        throw new Error('Failed to upload image to Cloudinary');
                    }
                })));
                const productData = {
                    name,
                    description,
                    price,
                    category,
                    images: uploadedImages,
                    seller,
                    partName,
                    materialName,
                    ecoFriendlyBoolean,
                };
                const newProduct = yield this.productService.createProduct(productData);
                const sellerDetails = yield user_model_1.default.findById(seller);
                const notificationMessage = `${newProduct.name} is available!`;
                if (server_1.stores['store']) {
                    server_1.stores['store'].forEach((storeSocketId) => {
                        server_2.io.to(storeSocketId).emit('receiveNotification', {
                            message: notificationMessage,
                            productId: newProduct._id,
                            firstName: sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.firstName,
                            lastName: sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.lastName,
                            profilePicture: sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.profilePicture
                        });
                    });
                }
                res
                    .status(statusCodes_1.StatusCodes.CREATED)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.CREATED, 'Product created successfully', newProduct));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to create product');
            }
        });
    }
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield this.productService.getProductById(id);
                if (!product) {
                    throw HttpException_1.default.NotFound('Product not found');
                }
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Product fetched successfully', product));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch product');
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, description, price, categories, partName, materialName, ecoFriendly, retainedImages = [], removedImages = [], } = req.body;
            const newImages = req.files;
            try {
                const product = yield this.productService.getProductById(id);
                if (!product) {
                    throw HttpException_1.default.NotFound('Product not found');
                }
                yield Promise.all(removedImages.map((imageUrl) => __awaiter(this, void 0, void 0, function* () {
                    yield cloudinary_service_1.default.deleteImage(imageUrl);
                    console.log(`Deleted image from Cloudinary: ${imageUrl}`);
                })));
                const uploadedNewImages = yield Promise.all(newImages.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield cloudinary_service_1.default.uploadImage(file.path);
                    if (result) {
                        console.log('Uploaded image:', result.secure_url);
                        return result.secure_url;
                    }
                    else {
                        throw new Error('Failed to upload new image to Cloudinary');
                    }
                })));
                const updatedImages = [...retainedImages, ...uploadedNewImages];
                const updatedProduct = yield this.productService.updateProduct(id, {
                    name,
                    description,
                    price,
                    categories,
                    images: updatedImages,
                    partName,
                    materialName,
                    ecoFriendly,
                });
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Product updated successfully', updatedProduct));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to update product');
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield this.productService.deleteProduct(id);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Product deleted successfully'));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to delete product');
            }
        });
    }
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.productService.getAllProducts();
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Products fetched successfully', products));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch products');
            }
        });
    }
    getProductsBySellerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sellerId } = req.params;
            try {
                const products = yield this.productService.getProductsBySellerId(sellerId);
                if (!products || products.length === 0) {
                    throw HttpException_1.default.NotFound('No products found for this user');
                }
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Products fetched successfully', products));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to fetch products for the user');
            }
        });
    }
    getRewardPoints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { part_name, material, eco_friendly, item_price } = req.body;
            if (!part_name || !material || eco_friendly === undefined || !item_price) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: part_name, material, eco_friendly, or item_price.',
                });
            }
            const inputData = {
                part_name,
                material,
                eco_friendly,
                item_price,
            };
            const rewardPoint = yield this.getRewardPoint(inputData);
            return res
                .status(statusCodes_1.StatusCodes.SUCCESS)
                .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Reward points provided successfully', rewardPoint));
        });
    }
};
exports.ProductController = ProductController;
exports.ProductController = ProductController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map