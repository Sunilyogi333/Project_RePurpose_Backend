import { Request, Response } from 'express';
import { ProductService } from '../../services/product/product.service'
import { createResponse } from '../../utils/response';
import { StatusCodes } from '../../constants/statusCodes';
import HttpException from '../../utils/HttpException';
import { injectable } from 'tsyringe';
import cloudinaryService from '../../services/cloudinary.service';


@injectable()
export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const { name, description, price, category } = req.body;
    const seller = req.user._id; 
    console.log("req.user:", req.user)
    const images = req.files as Express.Multer.File[];
    console.log("images", images)

    try {
      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        images.map(async (file) => {
          console.log("file path", file.path)
          const result = await cloudinaryService.uploadImage(file.path);
          if (result) {
            console.log("success of this image", result.secure_url);
            return result.secure_url; // Save the URL of the uploaded image
          }
          else {
            throw new Error('Failed to upload image to Cloudinary');
          }

        })
      );

      // Create product data including the image URLs
      const productData = { name, description, price, category, images: uploadedImages, seller };
      const newProduct = await this.productService.createProduct(productData);

      res.status(StatusCodes.CREATED).json(
        createResponse(true, StatusCodes.CREATED, 'Product created successfully', newProduct)
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to create product');
    }

  }

  async getProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const product = await this.productService.getProductById(id);

      if (!product) {
        throw HttpException.NotFound('Product not found');
      }

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Product fetched successfully', product)
      );
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch product');
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, description, price, categories, retainedImages = [], removedImages = [] } = req.body;
    const newImages = req.files as Express.Multer.File[];
  
    try {
      // Fetch the existing product
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw HttpException.NotFound('Product not found');
      }
  
      // Step 1: Delete removed images from Cloudinary
      await Promise.all(
        removedImages.map(async (imageUrl: string) => {
          await cloudinaryService.deleteImage(imageUrl);
          console.log(`Deleted image from Cloudinary: ${imageUrl}`);
        })
      );
  
      // Step 2: Upload new images to Cloudinary
      const uploadedNewImages = await Promise.all(
        newImages.map(async (file) => {
          const result = await cloudinaryService.uploadImage(file.path);
          if (result) {
            console.log('Uploaded image:', result.secure_url);
            return result.secure_url;
          } else {
            throw new Error('Failed to upload new image to Cloudinary');
          }
        })
      );
  
      // Step 3: Combine retained and new images
      const updatedImages = [...retainedImages, ...uploadedNewImages];
  
      // Step 4: Update the product
      const updatedProduct = await this.productService.updateProduct(id, {
        name,
        description,
        price,
        categories,
        images: updatedImages, // Save updated images
      });
  
      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Product updated successfully', updatedProduct)
      );
    } catch (error) {
      console.error(error);
      throw HttpException.InternalServer('Failed to update product');
    }
  }
  

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await this.productService.deleteProduct(id);

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Product deleted successfully')
      );
    } catch (error) {
      throw HttpException.InternalServer('Failed to delete product');
    }
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Products fetched successfully', products)
      );
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch products');
    }
  }
}
