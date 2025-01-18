import { PRODUCT_STATUS as ProductStatus } from '../constants/enum';
export declare class CreateProductDTO {
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    status: ProductStatus;
    seller: string;
}
