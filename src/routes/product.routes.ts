import { Router } from 'express';
import { ROLE } from '../constants/enum';
import { ProductController } from '../controllers/product/product.controller';
import RequestValidator from '../middlewares/Request.Validator';
import authentication from '../middlewares/authentication.middleware';
import { catchAsync } from '../utils/catchAsync';
import { CreateProductDTO } from '../dtos/product.dto'
import { container } from 'tsyringe';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Temporary storage for images
const router = Router();
const productController = container.resolve(ProductController);

// Create product
router.post(
  '/',
  authentication([ROLE.ADMIN, ROLE.SELLER]), // Authorization based on role
  upload.array('images', 3), // Limit to 3 images
  RequestValidator.validate(CreateProductDTO), // Validate request body
  catchAsync(productController.createProduct.bind(productController))
);

// Get all products
router.get(
  '/',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER]),
  catchAsync(productController.getProducts.bind(productController))
);

// Handle undefined routes
router.all('/*', (req, res) => {
  res.status(405).json({ message: 'Method not allowed' });
});

export default router;
