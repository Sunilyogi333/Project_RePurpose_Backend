"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enum_1 = require("../constants/enum");
const store_controller_1 = require("../controllers/store/store.controller");
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const catchAsync_1 = require("../utils/catchAsync");
const tsyringe_1 = require("tsyringe");
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const router = (0, express_1.Router)();
const iocStoreController = tsyringe_1.container.resolve(store_controller_1.StoreController);
router.post('/KYC', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE]), multer_middleware_1.default.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'businessRegCertificate', maxCount: 1 },
    { name: 'storeFrontImage', maxCount: 1 },
]), (0, catchAsync_1.catchAsync)(iocStoreController.createStoreKYC.bind(iocStoreController)));
router.get('/', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE, enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.getStores.bind(iocStoreController)));
router.get('/pending', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE, enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.getPendingStores.bind(iocStoreController)));
router.get('/my-kyc', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(iocStoreController.getMyStoreKYC.bind(iocStoreController)));
router.get('/:storeId', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE, enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.getStore.bind(iocStoreController)));
router.patch('/:storeId', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE]), multer_middleware_1.default.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'businessRegCertificate', maxCount: 1 },
    { name: 'storeFrontImage', maxCount: 1 },
]), (0, catchAsync_1.catchAsync)(iocStoreController.updateStoreKYC.bind(iocStoreController)));
router.patch('/:storeId/approve', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.approveStore.bind(iocStoreController)));
router.delete('/:storeId/reject', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.rejectStore.bind(iocStoreController)));
router.patch('/:storeId/pending', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.requestModificationStore.bind(iocStoreController)));
router.all('/*', (req, res) => {
    throw HttpException_1.default.MethodNotAllowed('Route not allowed');
});
exports.default = router;
//# sourceMappingURL=store.routes.js.map