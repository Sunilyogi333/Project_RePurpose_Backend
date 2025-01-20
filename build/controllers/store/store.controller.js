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
const store_model_1 = __importDefault(require("../..//models/store.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const statusCodes_1 = require("../../constants/statusCodes");
const response_1 = require("../../utils/response");
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
let StoreController = class StoreController {
    createStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeData = req.body;
            try {
                const newStore = yield store_model_1.default.create(storeData);
                res.status(statusCodes_1.StatusCodes.CREATED).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.CREATED, 'Store created successfully', newStore));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to create store');
            }
        });
    }
    getStores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield store_model_1.default.find();
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Stores fetched successfully', stores));
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
                yield user_model_1.default.findByIdAndUpdate(store.userID, { isStoreVerified: true });
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store approved successfully'));
            }
            catch (error) {
                console.error(error);
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
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store rejected and deleted successfully'));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to reject store');
            }
        });
    }
    updateStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const storeData = req.body;
            try {
                const updatedStore = yield store_model_1.default.findByIdAndUpdate(storeId, storeData, { new: true });
                if (!updatedStore) {
                    throw HttpException_1.default.NotFound('Store not found');
                }
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store updated successfully', updatedStore));
            }
            catch (error) {
                console.error(error);
                throw HttpException_1.default.InternalServer('Failed to update store');
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
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Store fetched successfully', store));
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