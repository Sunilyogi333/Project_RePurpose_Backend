"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enum_1 = require("../constants/enum");
const product_controller_1 = require("../controllers/product/product.controller");
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const catchAsync_1 = require("../utils/catchAsync");
const tsyringe_1 = require("tsyringe");
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const router = (0, express_1.Router)();
const productController = tsyringe_1.container.resolve(product_controller_1.ProductController);
router.post('/', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER]), multer_middleware_1.default.array('images', 5), (0, catchAsync_1.catchAsync)(productController.createProduct.bind(productController)));
router.get('/:id', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER, enum_1.ROLE.MEMBER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.getProduct.bind(productController)));
router.put('/:id', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER]), multer_middleware_1.default.array('images', 3), (0, catchAsync_1.catchAsync)(productController.updateProduct.bind(productController)));
router.delete('/:id', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.deleteProduct.bind(productController)));
router.get('/', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.getProducts.bind(productController)));
router.get('/seller/:sellerId', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.getProductsBySellerId.bind(productController)));
router.post('/:productId/request', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.requestForBuy.bind(productController)));
router.get('/:productId/requests', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.getRequestsOnProduct.bind(productController)));
router.post('/:productId/accept/:requestId', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.acceptRequestOnProduct.bind(productController)));
router.get('/purchase-requests/:productId/:storeOwnerId', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(productController.getPurchaseRequests.bind(productController)));
router.post('/reward-points', (0, catchAsync_1.catchAsync)(productController.getRewardPoints.bind(productController)));
router.all('/*', (req, res) => {
    res.status(405).json({ message: 'Method not allowed' });
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map