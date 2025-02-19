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
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const user_service_1 = require("../../services/user/user.service");
const cloudinary_service_1 = __importDefault(require("../../services/cloudinary.service"));
const response_1 = require("../../utils/response");
const statusCodes_1 = require("../../constants/statusCodes");
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
const user_model_1 = __importDefault(require("../../models/user.model"));
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Current user fetched successfully', user));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch current user');
            }
        });
    }
    editProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const profilePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            if (!profilePath) {
                throw HttpException_1.default.BadRequest('Profile picture is required');
            }
            try {
                if (req.user.profilePicture) {
                    yield cloudinary_service_1.default.deleteImage(req.user.profilePicture);
                }
                const imageResult = yield cloudinary_service_1.default.uploadImage(profilePath);
                if (!imageResult) {
                    throw HttpException_1.default.NotFound('Image upload to Cloudinary failed');
                }
                const updatedUser = yield this.userService.updateUser(req.user._id, {
                    profilePicture: imageResult.secure_url,
                });
                console.log("updated user", updatedUser);
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Profile picture updated successfully', updatedUser));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Error updating profile picture');
            }
        });
    }
    editAccountDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, phoneNumber } = req.body;
            if (!firstName || !lastName || !phoneNumber) {
                throw HttpException_1.default.BadRequest('All fields are required');
            }
            try {
                const updatedUser = yield this.userService.updateUser(req.user._id, {
                    firstName,
                    lastName,
                    phoneNumber,
                });
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'User details updated successfully', updatedUser));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Error updating account details');
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAllUsers();
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Users fetched successfully', users));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch users');
            }
        });
    }
    allUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.query", req.query);
                const { search } = req.query;
                console.log("search", search);
                console.log("req.user", req.user);
                const users = yield user_model_1.default.find({
                    email: search,
                    _id: { $ne: req.user._id },
                });
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, "Users retrieved successfully", users));
            }
            catch (error) {
                console.error("User fetch error:", error);
                throw HttpException_1.default.InternalServer("Error occurred while fetching users");
            }
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map