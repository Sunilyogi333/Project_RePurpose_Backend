import { Router } from 'express';
import { container } from 'tsyringe';
import { CategoryController } from '../controllers/category/category.controller'
import RequestValidator from '../middlewares/Request.Validator'; 
import authentication from '../middlewares/authentication.middleware';
import HttpException from '../utils/HttpException'; 
import { catchAsync } from '../utils/catchAsync'; 
import { ROLE } from '../constants/enum';
import { CreateCategoryDTO, UpdateCategoryDTO, AddSubcategoryDTO, RemoveSubcategoryDTO } from '../dtos/category.dot';

const router = Router();
const iocCategoryController = container.resolve(CategoryController);

// Get category by ID
router.get(
  '/:id',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER]),
  catchAsync(iocCategoryController.getCategoryById.bind(iocCategoryController))
);

// Create a new category
router.post(
    '/',
    RequestValidator.validate(CreateCategoryDTO),
    catchAsync(iocCategoryController.createCategory.bind(iocCategoryController))
  );
  

// Update a category by ID
router.patch(
    '/:id',
    RequestValidator.validate(UpdateCategoryDTO),
    catchAsync(iocCategoryController.updateCategory.bind(iocCategoryController))
  );
  

// Delete a category by ID
router.delete(
  '/:id',
  authentication([ROLE.ADMIN]),
  catchAsync(iocCategoryController.deleteCategory.bind(iocCategoryController))
);

// List all categories
router.get(
  '/',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER]),
  catchAsync(iocCategoryController.listAllCategories.bind(iocCategoryController))
);

// Find categories by a specific field
router.get(
  '/search',
  authentication([ROLE.ADMIN]),
  catchAsync(iocCategoryController.findCategoriesByField.bind(iocCategoryController))
);

// Add a subcategory to a category
router.post(
    '/:id/subcategory',
    RequestValidator.validate(AddSubcategoryDTO),
    catchAsync(iocCategoryController.addSubcategory.bind(iocCategoryController))
  );
  

// Remove a subcategory from a category
router.delete(
    '/:id/subcategory',
    RequestValidator.validate(RemoveSubcategoryDTO),
    catchAsync(iocCategoryController.removeSubcategory.bind(iocCategoryController))
  );
  
// Handle undefined routes
router.all('/*', (req, res) => {
  throw HttpException.MethodNotAllowed('Route not allowed');
});

export default router;
