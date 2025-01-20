import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import Store from '../..//models/store.model'; 
import User from '../../models/user.model';
import { CreateStoreDTO, UpdateStoreDTO } from '../../dtos/store.dto';
import { StatusCodes } from '../../constants/statusCodes';
import { createResponse } from '../../utils/response';
import HttpException from '../../utils/HttpException';

@injectable()
export class StoreController {
  async createStore(req: Request, res: Response): Promise<void> {
    const storeData: CreateStoreDTO = req.body;

    try {
      const newStore = await Store.create(storeData);

      res.status(StatusCodes.CREATED).json(
        createResponse(true, StatusCodes.CREATED, 'Store created successfully', newStore)
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to create store');
    }
  }

  async getStores(req: Request, res: Response): Promise<void> {
    try {
      const stores = await Store.find();

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Stores fetched successfully', stores)
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to fetch stores');
    }
  }

  async approveStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;

    try {
      const store = await Store.findById(storeId);
      if (!store) {
        throw HttpException.NotFound('Store not found');
      }

      // Update the `isStoreVerified` field for the user
      await User.findByIdAndUpdate(store.userID, { isStoreVerified: true });

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Store approved successfully')
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to approve store');
    }
  }

  async rejectStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;

    try {
      const store = await Store.findByIdAndDelete(storeId);
      if (!store) {
        throw HttpException.NotFound('Store not found');
      }

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Store rejected and deleted successfully')
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to reject store');
    }
  }

  async updateStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const storeData: UpdateStoreDTO = req.body;

    try {
      const updatedStore = await Store.findByIdAndUpdate(storeId, storeData, { new: true });
      if (!updatedStore) {
        throw HttpException.NotFound('Store not found');
      }

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Store updated successfully', updatedStore)
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to update store');
    }
  }

  async getStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;

    try {
      const store = await Store.findById(storeId);
      if (!store) {
        throw HttpException.NotFound('Store not found');
      }

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Store fetched successfully', store)
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to fetch store');
    }
  }
}
