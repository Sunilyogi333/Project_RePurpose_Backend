import { Router } from 'express'
import { ROLE } from '../constants/enum'
import { ProductController } from '../controllers/product/product.controller'
import RequestValidator from '../middlewares/Request.Validator'
import authentication from '../middlewares/authentication.middleware'
import { catchAsync } from '../utils/catchAsync'
import { CreateProductDTO } from '../dtos/product.dto'
import { container } from 'tsyringe'
import upload from '../middlewares/multer.middleware'

const router = Router()
const productController = container.resolve(ProductController)

// Create product
router.post(
  '/',
  authentication([ROLE.ADMIN, ROLE.SELLER]), // Authorization based on role
  upload.array('images', 5), // Limit to 5 images
  // RequestValidator.validate(CreateProductDTO), // Validate request body
  catchAsync(productController.createProduct.bind(productController))
)

// Get product by ID
router.get(
  '/:id',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.MEMBER, ROLE.STORE]),
  catchAsync(productController.getProduct.bind(productController))
)

// Update product
router.put(
  '/:id',
  authentication([ROLE.ADMIN, ROLE.SELLER]), // Only admin and sellers can update
  upload.array('images', 3), // Limit to 3 images
  catchAsync(productController.updateProduct.bind(productController))
)

// Delete product
router.delete(
  '/:id',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]), // Only admin and sellers can delete
  catchAsync(productController.deleteProduct.bind(productController))
)

// Get all products
router.get(
  '/',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.getProducts.bind(productController))
)
// Get all pending products
router.get(
  '/all/Pending',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.getAllPendingProducts.bind(productController))
)

router.get(
  '/all/availableForMe',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.getAllPendingProductsForMe.bind(productController))
)
router.get(
  '/store/myRequestedProducts',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.myRequestedProducts.bind(productController))
)

router.get(
  '/store/myBoughtProducts',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.myBoughtProducts.bind(productController))
)

// Get pending products
router.get(
  '/seller/pending/:sellerId',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.getPendingProductsBySellerId.bind(productController))
)

// Get pending products
router.get(
  '/seller/sold/:sellerId',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.getSoldProductsBySellerId.bind(productController))
)

// Get products by seller ID
router.get(
  '/seller/:sellerId',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]), // Only admin and sellers can view products of a specific seller
  catchAsync(productController.getProductsBySellerId.bind(productController))
)

router.post(
  '/:productId/request',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]), // Only admin and sellers can view products of a specific seller
  catchAsync(productController.requestForBuy.bind(productController))
)

router.get(
  '/:productId/requests',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]), // Only admin and sellers can view products of a specific seller
  catchAsync(productController.getRequestsOnProduct.bind(productController))
)

router.post(
  '/:productId/accept/:requestId',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]), // Only admin and sellers can view products of a specific seller
  catchAsync(productController.acceptRequestOnProduct.bind(productController))
)

router.get(
  '/purchase-requests/:productId/:storeOwnerId',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(productController.getPurchaseRequests.bind(productController))
)

// Get reward points
router.post(
  '/reward-points',
  // Optional: authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.MEMBER]),
  catchAsync(productController.getRewardPoints.bind(productController))
)

// Handle undefined routes
router.all('/*', (req, res) => {
  res.status(405).json({ message: 'Method not allowed' })
})

export default router
