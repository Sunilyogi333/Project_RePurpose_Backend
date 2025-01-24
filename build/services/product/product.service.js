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
exports.ProductService = void 0;
const product_model_1 = __importDefault(require("../../models/product.model"));
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
class ProductService {
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.default.findById(productId)
                .populate({
                path: 'seller',
                select: 'firstName lastName email profilePicture',
            })
                .exec();
        });
    }
    createProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = new product_model_1.default(productData);
            yield newProduct.save();
            return newProduct;
        });
    }
    updateProduct(productId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, updateData, { new: true });
            if (!updatedProduct) {
                throw HttpException_1.default.NotFound('Product not found');
            }
            return updatedProduct;
        });
    }
    deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedProduct = yield product_model_1.default.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw HttpException_1.default.NotFound('Product not found');
            }
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.default.find();
        });
    }
    getProductsBySellerId(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield product_model_1.default.find({ seller: sellerId });
                if (!products || products.length === 0) {
                    throw HttpException_1.default.NotFound('No products found for this seller');
                }
                return products;
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch products by seller ID');
            }
        });
    }
    findProductsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.default.find({ category });
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map