import Product from '../../models/product.model'
import { IProduct } from '../../interfaces/product.interface'
import HttpException from '../../utils/HttpException'

export class ProductService {
  // async getProductById(productId: string): Promise<IProduct | null> {
  //   return Product.findById(productId)
  // }

  async getProductById(productId: string): Promise<IProduct | null> {
    return Product.findById(productId)
      .populate({
        path: 'seller',
        select: 'firstName lastName email profilePicture', // Specify the fields to populate
      })
      .exec(); // Execute the query
  }
  

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    const newProduct = new Product(productData)
    await newProduct.save()
    return newProduct
  }

  async updateProduct(productId: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true })
    if (!updatedProduct) {
      throw HttpException.NotFound('Product not found')
    }
    return updatedProduct
  }

  async deleteProduct(productId: string): Promise<void> {
    const deletedProduct = await Product.findByIdAndDelete(productId)
    if (!deletedProduct) {
      throw HttpException.NotFound('Product not found')
    }
  }

  async getAllProducts(): Promise<IProduct[]> {
    return Product.find()
  }

  async getProductsBySellerId(sellerId: string): Promise<IProduct[]> {
    try {
      const products = await Product.find({ seller: sellerId })
      if (!products || products.length === 0) {
        throw HttpException.NotFound('No products found for this seller')
      }
      return products
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch products by seller ID')
    }
  }

  async findProductsByCategory(category: string): Promise<IProduct[]> {
    return Product.find({ category })
  }
}
