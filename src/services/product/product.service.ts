import Product from '../../models/product.model'
import { IProduct } from '../../interfaces/product.interface';
import HttpException from '../../utils/HttpException';

export class ProductService {
  async getProductById(productId: string): Promise<IProduct | null> {
    return Product.findById(productId);
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    const existingProduct = await Product.findOne({ name: productData.name });
    if (existingProduct) {
      throw HttpException.Conflict('Product with this name already exists');
    }

    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  async updateProduct(productId: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (!updatedProduct) {
      throw HttpException.NotFound('Product not found');
    }
    return updatedProduct;
  }

  async deleteProduct(productId: string): Promise<void> {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw HttpException.NotFound('Product not found');
    }
  }

  async getAllProducts(): Promise<IProduct[]> {
    return Product.find();
  }

  async findProductsByCategory(category: string): Promise<IProduct[]> {
    return Product.find({ category });
  }
}
