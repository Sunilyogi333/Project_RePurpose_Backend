"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enum_1 = require("../constants/enum");
const user_controller_1 = require("../controllers/user/user.controller");
const user_dto_1 = require("../dtos/user.dto");
const Request_Validator_1 = __importDefault(require("../middlewares/Request.Validator"));
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const catchAsync_1 = require("../utils/catchAsync");
const tsyringe_1 = require("tsyringe");
const multer_middleware_1 = __importDefault(require("../middlewares/multer.middleware"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const router = (0, express_1.Router)();
const iocUserController = tsyringe_1.container.resolve(user_controller_1.UserController);
router.get('/me', (0, authentication_middleware_1.default)([enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.ADMIN, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(iocUserController.getCurrentUser.bind(iocUserController)));
router.patch('/profile-picture', (0, authentication_middleware_1.default)([enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), multer_middleware_1.default.single('profilePicture'), (0, catchAsync_1.catchAsync)(iocUserController.editProfilePicture.bind(iocUserController)));
router.patch('/edit', (0, authentication_middleware_1.default)([enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), Request_Validator_1.default.validate(user_dto_1.EditUserDTO), (0, catchAsync_1.catchAsync)(iocUserController.editAccountDetails.bind(iocUserController)));
router.get('/all', (0, catchAsync_1.catchAsync)(iocUserController.getAllUsers.bind(iocUserController)));
router.all('/*', (req, res) => {
    throw HttpException_1.default.MethodNotAllowed('Route not allowed');
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map