import { Request, Response } from 'express';
import { ProductService } from '../../services/product/product.service'
import { createResponse } from '../../utils/response';
import { StatusCodes } from '../../constants/statusCodes';
import HttpException from '../../utils/HttpException';
import { injectable } from 'tsyringe';

@injectable()
export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const { name, description, price, category, images } = req.body;

    try {
      const productData = { name, description, price, category, images };
      const newProduct = await this.productService.createProduct(productData);

      res.status(StatusCodes.CREATED).json(
        createResponse(true, StatusCodes.CREATED, 'Product created successfully', newProduct)
      );
    } catch (error) {
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
    const { name, description, price, categories, images } = req.body;

    try {
      const updatedProduct = await this.productService.updateProduct(id, {
        name,
        description,
          price,
        categories,
        images,
      });

      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Product updated successfully', updatedProduct)
      );
    } catch (error) {
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
