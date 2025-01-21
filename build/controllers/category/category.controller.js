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
exports.CategoryController = void 0;
const category_service_1 = require("../../services/category/category.service");
const response_1 = require("../../utils/response");
const statusCodes_1 = require("../../constants/statusCodes");
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
const tsyringe_1 = require("tsyringe");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const category = yield this.categoryService.findCategoryById(id);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Category found', category));
            }
            catch (error) {
                throw error;
            }
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryData = req.body;
            try {
                const newCategory = yield this.categoryService.createCategory(categoryData);
                res.status(statusCodes_1.StatusCodes.CREATED).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.CREATED, 'Category created successfully', newCategory));
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = req.body;
            try {
                const updatedCategory = yield this.categoryService.updateCategory(id, updateData);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Category updated successfully', updatedCategory));
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield this.categoryService.deleteCategory(id);
                res.status(statusCodes_1.StatusCodes.NO_CONTENT).send();
            }
            catch (error) {
                throw error;
            }
        });
    }
    listAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.categoryService.listAllCategories();
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Categories fetched successfully', categories));
            }
            catch (error) {
                throw error;
            }
        });
    }
    findCategoriesByField(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { field, value } = req.query;
            if (!field || !value) {
                throw HttpException_1.default.BadRequest('Field and value are required');
            }
            try {
                const categories = yield this.categoryService.findCategoriesByField(field, value);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Categories found', categories));
            }
            catch (error) {
                throw error;
            }
        });
    }
    addSubcategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { subcategoryId } = req.body;
            try {
                const updatedCategory = yield this.categoryService.addSubcategory(id, subcategoryId);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Subcategory added successfully', updatedCategory));
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeSubcategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { subcategoryId } = req.body;
            try {
                const updatedCategory = yield this.categoryService.removeSubcategory(id, subcategoryId);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Subcategory removed successfully', updatedCategory));
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.CategoryController = CategoryController;
exports.CategoryController = CategoryController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map