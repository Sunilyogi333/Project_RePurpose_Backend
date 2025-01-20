import { PRODUCT_STATUS as ProductStatus } from '../constants/enum';
export declare class CreateProductDTO {
    name: string;
    description: string;
    price: number;
    images?: string[];
    partName?: 'Interior' | 'Exterior';
    ecoFriendly?: boolean;
    materialName?: 'Elastane' | 'Viscose' | 'Acrylic' | 'Cotton' | 'Lyocell' | 'Polyamide' | 'Nylon' | 'Fiber' | 'Modal' | 'Camel' | 'Linen' | 'Wool' | 'Cupro';
    categories?: string[];
    attributes?: {
        name: string;
        value: string;
    }[];
    condition?: number;
    code?: string;
    seller: string;
    postedBy?: string;
    status?: ProductStatus;
}
