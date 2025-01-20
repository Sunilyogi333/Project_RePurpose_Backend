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
exports.FindCategoriesByFieldDTO = exports.RemoveSubcategoryDTO = exports.AddSubcategoryDTO = exports.UpdateCategoryDTO = exports.CreateCategoryDTO = void 0;
const class_validator_1 = require("class-validator");
class CreateCategoryDTO {
}
exports.CreateCategoryDTO = CreateCategoryDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateCategoryDTO.prototype, "parentCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCategoryDTO.prototype, "isActive", void 0);
class UpdateCategoryDTO {
}
exports.UpdateCategoryDTO = UpdateCategoryDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCategoryDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateCategoryDTO.prototype, "parentCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCategoryDTO.prototype, "isActive", void 0);
class AddSubcategoryDTO {
}
exports.AddSubcategoryDTO = AddSubcategoryDTO;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], AddSubcategoryDTO.prototype, "subcategoryId", void 0);
class RemoveSubcategoryDTO {
}
exports.RemoveSubcategoryDTO = RemoveSubcategoryDTO;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], RemoveSubcategoryDTO.prototype, "subcategoryId", void 0);
class FindCategoriesByFieldDTO {
}
exports.FindCategoriesByFieldDTO = FindCategoriesByFieldDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindCategoriesByFieldDTO.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindCategoriesByFieldDTO.prototype, "value", void 0);
//# sourceMappingURL=category.dot.js.map