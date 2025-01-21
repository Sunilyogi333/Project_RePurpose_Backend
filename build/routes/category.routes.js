"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const category_controller_1 = require("../controllers/category/category.controller");
const Request_Validator_1 = __importDefault(require("../middlewares/Request.Validator"));
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const catchAsync_1 = require("../utils/catchAsync");
const enum_1 = require("../constants/enum");
const category_dot_1 = require("../dtos/category.dot");
const router = (0, express_1.Router)();
const iocCategoryController = tsyringe_1.container.resolve(category_controller_1.CategoryController);
router.get('/:id', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER]), (0, catchAsync_1.catchAsync)(iocCategoryController.getCategoryById.bind(iocCategoryController)));
router.post('/', Request_Validator_1.default.validate(category_dot_1.CreateCategoryDTO), (0, catchAsync_1.catchAsync)(iocCategoryController.createCategory.bind(iocCategoryController)));
router.patch('/:id', Request_Validator_1.default.validate(category_dot_1.UpdateCategoryDTO), (0, catchAsync_1.catchAsync)(iocCategoryController.updateCategory.bind(iocCategoryController)));
router.delete('/:id', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocCategoryController.deleteCategory.bind(iocCategoryController)));
router.get('/', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER]), (0, catchAsync_1.catchAsync)(iocCategoryController.listAllCategories.bind(iocCategoryController)));
router.get('/search', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocCategoryController.findCategoriesByField.bind(iocCategoryController)));
router.post('/:id/subcategory', Request_Validator_1.default.validate(category_dot_1.AddSubcategoryDTO), (0, catchAsync_1.catchAsync)(iocCategoryController.addSubcategory.bind(iocCategoryController)));
router.delete('/:id/subcategory', Request_Validator_1.default.validate(category_dot_1.RemoveSubcategoryDTO), (0, catchAsync_1.catchAsync)(iocCategoryController.removeSubcategory.bind(iocCategoryController)));
router.all('/*', (req, res) => {
    throw HttpException_1.default.MethodNotAllowed('Route not allowed');
});
exports.default = router;
//# sourceMappingURL=category.routes.js.map