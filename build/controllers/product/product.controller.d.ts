import { Request, Response } from 'express';
import { ProductService } from '../../services/product/product.service';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    createProduct(req: Request, res: Response): Promise<void>;
    getProduct(req: Request, res: Response): Promise<void>;
    updateProduct(req: Request, res: Response): Promise<void>;
    deleteProduct(req: Request, res: Response): Promise<void>;
    getProducts(req: Request, res: Response): Promise<void>;
    getProductsBySellerId(req: Request, res: Response): Promise<void>;
    requestForBuy(req: Request, res: Response): Promise<void>;
    getRequestsOnProduct(req: Request, res: Response): Promise<void>;
    acceptRequestOnProduct(req: Request, res: Response): Promise<void>;
    getPurchaseRequests(req: Request, res: Response): Promise<void>;
    getRewardPoints(req: Request, res: Response): Promise<Response>;
    getRewardPoint: (inputData: Object) => Promise<unknown>;
}
