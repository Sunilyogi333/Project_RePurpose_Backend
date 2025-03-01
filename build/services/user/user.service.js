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
exports.UserService = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
class UserService {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ email });
        });
    }
    findByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ refreshToken });
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.findByEmail(userData.email);
            if (existingUser) {
                throw HttpException_1.default.Conflict('Email already in use');
            }
            const newUser = new user_model_1.default(userData);
            yield newUser.save();
            return newUser;
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findByIdAndUpdate(userId, updateData, { new: true });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findById(id);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.find();
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOne({ googleId });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByIdAndDelete(userId);
            if (!user) {
                throw HttpException_1.default.NotFound('User not found');
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map