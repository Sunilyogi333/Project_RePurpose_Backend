"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enum_1 = require("../constants/enum");
const store_controller_1 = require("../controllers/store/store.controller");
const store_dto_1 = require("../dtos/store.dto");
const Request_Validator_1 = __importDefault(require("../middlewares/Request.Validator"));
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const catchAsync_1 = require("../utils/catchAsync");
const tsyringe_1 = require("tsyringe");
const router = (0, express_1.Router)();
const iocStoreController = tsyringe_1.container.resolve(store_controller_1.StoreController);
router.post('/create', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE]), Request_Validator_1.default.validate(store_dto_1.CreateStoreDTO), (0, catchAsync_1.catchAsync)(iocStoreController.createStore.bind(iocStoreController)));
router.get('/', (0, catchAsync_1.catchAsync)(iocStoreController.getStores.bind(iocStoreController)));
router.get('/:storeId', (0, catchAsync_1.catchAsync)(iocStoreController.getStore.bind(iocStoreController)));
router.patch('/:storeId', (0, authentication_middleware_1.default)([enum_1.ROLE.STORE, enum_1.ROLE.ADMIN]), Request_Validator_1.default.validate(store_dto_1.UpdateStoreDTO), (0, catchAsync_1.catchAsync)(iocStoreController.updateStore.bind(iocStoreController)));
router.patch('/:storeId/approve', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.approveStore.bind(iocStoreController)));
router.delete('/:storeId/reject', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocStoreController.rejectStore.bind(iocStoreController)));
router.all('/*', (req, res) => {
    throw HttpException_1.default.MethodNotAllowed('Route not allowed');
});
exports.default = router;
//# sourceMappingURL=store.routes.js.map