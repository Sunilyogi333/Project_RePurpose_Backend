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

  @Transform(({ value }) => parseFloat(value)) // Transform to number
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be a non-negative number' })
  price: number;

  @IsArray()
  @IsOptional()
  images?: string[]; // URLs of uploaded images

  @IsString()
  @IsOptional()
  partName?: 'Interior' | 'Exterior'; // Enum validation is implicit in the schema

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
    | 'Cupro'; // Enum validation via literal types

  @IsArray()
  @IsMongoId({ each: true }) // Validate each item in the array
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

  @IsMongoId()
  seller: string; // Required field

  @IsOptional()
  @IsMongoId()
  postedBy?: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus = ProductStatus.AVAILABLE;
}
