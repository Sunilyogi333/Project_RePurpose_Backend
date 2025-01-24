import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsArray, 
  IsEnum, 
  IsMongoId, 
  Min, 
  Max 
} from 'class-validator';
import { Transform } from 'class-transformer';

import { PRODUCT_STATUS as ProductStatus } from '../constants/enum';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be a non-negative number' })
  price: number;

  @IsArray()
  @IsOptional()
  images?: string[]; 

  @IsString()
  @IsOptional()
  partName?: 'Interior' | 'Exterior'; 

  @IsOptional()
  ecoFriendly?: boolean;

  @IsString()
  @IsOptional()
  materialName?: 
    | 'Elastane' 
    | 'Viscose' 
    | 'Acrylic' 
    | 'Cotton' 
    | 'Lyocell' 
    | 'Polyamide' 
    | 'Nylon' 
    | 'Fiber' 
    | 'Modal' 
    | 'Camel' 
    | 'Linen' 
    | 'Wool' 
    | 'Cupro'; 

  @IsArray()
  @IsMongoId({ each: true }) 
  @IsOptional()
  categories?: string[];

  @IsArray()
  @IsOptional()
  attributes?: { name: string; value: string }[];

  @IsNumber({}, { message: 'Condition must be a number' })
  @Min(1, { message: 'Condition must be at least 1' })
  @Max(5, { message: 'Condition cannot exceed 5' })
  @IsOptional()
  condition?: number;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus = ProductStatus.AVAILABLE;
}
