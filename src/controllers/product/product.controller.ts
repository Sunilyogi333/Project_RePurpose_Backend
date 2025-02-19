import { Request, Response } from 'express'
import { ProductService } from '../../services/product/product.service'
import NotificationService from '../../services/notification.service'
import User from '../../models/user.model'
import { createResponse } from '../../utils/response'
import { StatusCodes } from '../../constants/statusCodes'
import HttpException from '../../utils/HttpException'
import { injectable } from 'tsyringe'
import cloudinaryService from '../../services/cloudinary.service'
import { PythonShell } from 'python-shell'
import { stores } from '../../server'; // Adjust the path based on your project structure
import { io } from '../../server'
import PurchaseRequest from '../../models/purchaseRequest.model'
import Store from '../../models/store.model'

@injectable()
export class ProductController {
  private productService: ProductService

  constructor(productService: ProductService) {
    this.productService = productService
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const { name, description, price, category, partName, materialName, ecoFriendly } = req.body
    const seller = req.user._id
    const ecoFriendlyBoolean = ecoFriendly === 'Yes'
    // console.log('req.user:', req.user)
    // console.log('req.file', req.files)
    const images = req.files as Express.Multer.File[]
    // console.log('images', images)

    try {
      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        images.map(async (file) => {
          console.log('file path', file.path)
          const result = await cloudinaryService.uploadImage(file.path)
          if (result) {
            console.log('success of this image', result.secure_url)
            return result.secure_url // Save the URL of the uploaded image
          } else {
            throw new Error('Failed to upload image to Cloudinary')
          }
        })
      )

      // Create product data including the image URLs
      const productData = {
        name,
        description,
        price,
        category,
        images: uploadedImages,
        seller,
        partName,
        materialName,
        ecoFriendlyBoolean,
      }
      const newProduct = await this.productService.createProduct(productData)

      // Send notifications to stores via Socket.IO
      // const storeIds = await User.find({ role: 'seller' }).select('_id')
      const sellerDetails = await User.findById(seller)
      const notificationMessage = `${newProduct.name} is available!`

      if (stores['store']) {
        stores['store'].forEach((storeSocketId:any) => {
          io.to(storeSocketId).emit('receiveNotification', {
            message: notificationMessage,
            productId: newProduct._id,
            firstName: sellerDetails?.firstName,
            lastName: sellerDetails?.lastName,
            profilePicture: sellerDetails?.profilePicture
          });
        });
      }
      res
        .status(StatusCodes.CREATED)
        .json(createResponse(true, StatusCodes.CREATED, 'Product created successfully', newProduct))
    } catch (error) {
      console.error(error)
      throw HttpException.InternalServer('Failed to create product')
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    try {
      const product = await this.productService.getProductById(id)

      if (!product) {
        throw HttpException.NotFound('Product not found')
      }

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Product fetched successfully', product))
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch product')
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const {
      name,
      description,
      price,
      categories,
      partName,
      materialName,
      ecoFriendly,
      retainedImages = [],
      removedImages = [],
    } = req.body
    const newImages = req.files as Express.Multer.File[]

    try {
      // Fetch the existing product
      const product = await this.productService.getProductById(id)
      if (!product) {
        throw HttpException.NotFound('Product not found')
      }

      // Step 1: Delete removed images from Cloudinary
      await Promise.all(
        removedImages.map(async (imageUrl: string) => {
          await cloudinaryService.deleteImage(imageUrl)
          console.log(`Deleted image from Cloudinary: ${imageUrl}`)
        })
      )

      // Step 2: Upload new images to Cloudinary
      const uploadedNewImages = await Promise.all(
        newImages.map(async (file) => {
          const result = await cloudinaryService.uploadImage(file.path)
          if (result) {
            console.log('Uploaded image:', result.secure_url)
            return result.secure_url
          } else {
            throw new Error('Failed to upload new image to Cloudinary')
          }
        })
      )

      // Step 3: Combine retained and new images
      const updatedImages = [...retainedImages, ...uploadedNewImages]

      // Step 4: Update the product
      const updatedProduct = await this.productService.updateProduct(id, {
        name,
        description,
        price,
        categories,
        images: updatedImages, // Save updated images
        partName,
        materialName,
        ecoFriendly,
      })

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Product updated successfully', updatedProduct))
    } catch (error) {
      console.error(error)
      throw HttpException.InternalServer('Failed to update product')
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    try {
      await this.productService.deleteProduct(id)

      res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Product deleted successfully'))
    } catch (error) {
      throw HttpException.InternalServer('Failed to delete product')
    }
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts()

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Products fetched successfully', products))
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch products')
    }
  }

  async getProductsBySellerId(req: Request, res: Response): Promise<void> {
    const { sellerId } = req.params

    try {
      // Fetch products by seller ID (userId)
      const products = await this.productService.getProductsBySellerId(sellerId)

      if (!products || products.length === 0) {
        throw HttpException.NotFound('No products found for this user')
      }

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Products fetched successfully', products))
    } catch (error) {
      console.error(error)
      throw HttpException.InternalServer('Failed to fetch products for the user')
    }
  }

  async requestForBuy(req: Request, res: Response):Promise<void>{
    const { productId } = req.params;
    const { proposedPrice } = req.body;
    const storeUserId = req.user._id;

    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw HttpException.NotFound('Product not found');
    }
    const store = await Store.findOne({ userID: storeUserId });
    if (!store) {
      throw HttpException.NotFound('Store not found');
    }
    const storeId = store._id;

    // Ensure the price is valid
    if (proposedPrice < 0) {
      throw HttpException.BadRequest('Invalid price');
    }

    // Check if the store has already requested
    const existingRequest = await PurchaseRequest.findOne({ product: productId, store: storeId });
    if (existingRequest) {
      throw HttpException.BadRequest('You have already requested this product');
    }

    // Create a new purchase request
    const request = new PurchaseRequest({
      product: productId,
      store: storeId,
      proposedPrice, 
    });

    await request.save();
    res
      .status(StatusCodes.CREATED)
      .json(createResponse(true, StatusCodes.CREATED, 'Purchase request submitted successfully', request));
  }

  async getRequestsOnProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;

    const requests = await PurchaseRequest.find({ product: productId, status: 'PENDING' }).populate('store', 'storeName ownerName storeFrontImage email phoneNumber storeNumber storeAddress'); 

    res
      .status(StatusCodes.SUCCESS)
      .json(createResponse(true, StatusCodes.SUCCESS, 'Requests fetched successfully', requests));
  }

  async acceptRequestOnProduct(req: Request, res: Response): Promise<void> {
    const { productId, requestId } = req.params;

    const request = await PurchaseRequest.findById(requestId); 
    if (!request || request.status !== 'PENDING') {
      throw HttpException.NotFound('Request not found or already processed');
    }

    // Update the request status
    request.status = 'APPROVED';
    await request.save();

    //and reject all other requests
    await PurchaseRequest.updateMany({ product: productId, _id: { $ne: requestId } }, { status: 'REJECTED' });

    // Update the product status
    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw HttpException.NotFound('Product not found');
    }
    product.status = 'SOLD';
    product.soldTo = request.store;
    await product.save();

    res
      .status(StatusCodes.SUCCESS)
      .json(createResponse(true, StatusCodes.SUCCESS, 'Request approved successfully', request));
  }

  async getPurchaseRequests(req: Request, res: Response): Promise<void> {
    console.log("ya aaye");
    const { productId, storeOwnerId } = req.params;
    const store = await Store.find({ userID: storeOwnerId });
    if (!store) {
      throw HttpException.NotFound('Store not found');
    }
  const storeId = store[0]._id;
    const existingRequest = await PurchaseRequest.find({ product: productId, store: storeId });

    res
      .status(StatusCodes.SUCCESS)
      .json(createResponse(true, StatusCodes.SUCCESS, 'Requests fetched successfully', existingRequest));
  }

  async getRewardPoints(req: Request, res: Response): Promise<Response> {
    const { part_name, material, eco_friendly, item_price } = req.body

    if (!part_name || !material || eco_friendly === undefined || !item_price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: part_name, material, eco_friendly, or item_price.',
      })
    }

    // Prepare input for Python script
    const inputData = {
      part_name,
      material,
      eco_friendly,
      item_price,
    }

    const rewardPoint = await this.getRewardPoint(inputData)
    return res
      .status(StatusCodes.SUCCESS)
      .json(createResponse(true, StatusCodes.SUCCESS, 'Reward points provided successfully', rewardPoint))
  }

  getRewardPoint = async (inputData: Object) => {
    return new Promise((resolve, reject) => {
      PythonShell.run('AI_MODEL/rewardPoint.py', {
        args: [JSON.stringify(inputData)],
        pythonOptions: ['-u'], // Unbuffered output for immediate feedback
      })
        .then((messages) => {
          // Parse the first message (expected to be JSON)
          const response = JSON.parse(messages[1]) // Adjust based on the correct index
          resolve(response) // Pass the parsed JSON object
        })
        .catch((error) => {
          console.error('Error in Python script:', error)
          reject('Failed to retrieve data from Python script')
        })
    })
  }
  
}
