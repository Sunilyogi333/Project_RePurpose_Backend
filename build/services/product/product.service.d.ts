import { IProduct } from '../../interfaces/product.interface';
export declare class ProductService {
    getProductById(productId: string): Promise<IProduct | null>;
    createProduct(productData: Partial<IProduct>): Promise<IProduct>;
    updateProduct(productId: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
    deleteProduct(productId: string): Promise<void>;
    getAllProducts(): Promise<IProduct[]>;
    findProductsByCategory(category: string): Promise<IProduct[]>;
}
