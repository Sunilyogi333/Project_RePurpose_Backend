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
exports.CategoryService = void 0;
const category_model_1 = __importDefault(require("../../models/category.model"));
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
const mongoose_1 = require("mongoose");
class CategoryService {
    findCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield category_model_1.default.findById(categoryId);
            if (!category) {
                throw HttpException_1.default.NotFound('Category not found');
            }
            return category;
        });
    }
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield category_model_1.default.findOne({ name: categoryData.name });
            if (existingCategory) {
                throw HttpException_1.default.Conflict('Category with this name already exists');
            }
            const newCategory = new category_model_1.default(categoryData);
            yield newCategory.save();
            return newCategory;
        });
    }
    updateCategory(categoryId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCategory = yield category_model_1.default.findByIdAndUpdate(categoryId, updateData, { new: true });
            if (!updatedCategory) {
                throw HttpException_1.default.NotFound('Category not found');
            }
            return updatedCategory;
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCategory = yield category_model_1.default.findByIdAndDelete(categoryId);
            if (!deletedCategory) {
                throw HttpException_1.default.NotFound('Category not found');
            }
        });
    }
    listAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return category_model_1.default.find();
        });
    }
    findCategoriesByField(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            query[field] = value;
            return category_model_1.default.find(query);
        });
    }
    addSubcategory(categoryId, subcategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.findCategoryById(categoryId);
            if (!category) {
                throw HttpException_1.default.NotFound('Category not found');
            }
            const subcategoryObjectId = new mongoose_1.Types.ObjectId(subcategoryId);
            if (!category.subcategories.includes(subcategoryObjectId)) {
                category.subcategories.push(subcategoryObjectId);
                yield category.save();
            }
            return category;
        });
    }
    removeSubcategory(categoryId, subcategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.findCategoryById(categoryId);
            if (!category) {
                throw HttpException_1.default.NotFound('Category not found');
            }
            const subcategoryObjectId = new mongoose_1.Types.ObjectId(subcategoryId);
            category.subcategories = category.subcategories.filter((id) => id.toString() !== subcategoryObjectId.toString());
            yield category.save();
            return category;
        });
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map