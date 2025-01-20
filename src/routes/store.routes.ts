import { Router } from 'express';
import { ROLE } from '../constants/enum';
import { StoreController } from '../controllers/store/store.controller';
import { CreateStoreDTO, UpdateStoreDTO } from '../dtos/store.dto';
import RequestValidator from '../middlewares/Request.Validator'; // Validation middleware
import authentication from '../middlewares/authentication.middleware'; // Auth middleware
import HttpException from '../utils/HttpException'; // Custom HTTP exception handler
import { catchAsync } from '../utils/catchAsync'; // Utility to handle async errors
import { container } from 'tsyringe';

const router = Router();
const iocStoreController = container.resolve(StoreController);

// Create a new store (Only authenticated users can create a store)
router.post(
  '/create',
  authentication([ROLE.STORE]),
  RequestValidator.validate(CreateStoreDTO),
  catchAsync(iocStoreController.createStore.bind(iocStoreController))
);

// Get all stores (Public)
router.get(
  '/',
  catchAsync(iocStoreController.getStores.bind(iocStoreController))
);

// Get a specific store by ID (Public)
router.get(
  '/:storeId',
  catchAsync(iocStoreController.getStore.bind(iocStoreController))
);

// Update a store (Only the store owner or admin can update)
router.patch(
  '/:storeId',
  authentication([ROLE.STORE, ROLE.ADMIN]),
  RequestValidator.validate(UpdateStoreDTO),
  catchAsync(iocStoreController.updateStore.bind(iocStoreController))
);

// Approve a store (Admin only)
router.patch(
  '/:storeId/approve',
  authentication([ROLE.ADMIN]),
  catchAsync(iocStoreController.approveStore.bind(iocStoreController))
);

// Reject and delete a store (Admin only)
router.delete(
  '/:storeId/reject',
  authentication([ROLE.ADMIN]),
  catchAsync(iocStoreController.rejectStore.bind(iocStoreController))
);

// Handle undefined routes
router.all('/*', (req, res) => {
  throw HttpException.MethodNotAllowed('Route not allowed');
});

export default router;
