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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfilePictureDTO = exports.CompleteProfileDTO = exports.VerifyUserDTO = exports.EditUserDTO = exports.RegisterUserDTO = void 0;
const class_validator_1 = require("class-validator");
class RegisterUserDTO {
}
exports.RegisterUserDTO = RegisterUserDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "storeName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserDTO.prototype, "role", void 0);
class EditUserDTO {
}
exports.EditUserDTO = EditUserDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditUserDTO.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditUserDTO.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], EditUserDTO.prototype, "phoneNumber", void 0);
class VerifyUserDTO {
}
exports.VerifyUserDTO = VerifyUserDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], VerifyUserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyUserDTO.prototype, "isEmailVerified", void 0);
class CompleteProfileDTO {
}
exports.CompleteProfileDTO = CompleteProfileDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteProfileDTO.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteProfileDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Store', 'Member']),
    __metadata("design:type", String)
], CompleteProfileDTO.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteProfileDTO.prototype, "storeName", void 0);
class UpdateProfilePictureDTO {
}
exports.UpdateProfilePictureDTO = UpdateProfilePictureDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Profile picture path is required' }),
    __metadata("design:type", String)
], UpdateProfilePictureDTO.prototype, "profilePicture", void 0);
//# sourceMappingURL=user.dto.js.map