import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
import { PRODUCT_STATUS as ProductStatus } from '../constants/enum'

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsOptional()
  images: string[]; // URLs of uploaded images

  @IsString()
  @IsOptional()
  category: string;

  @IsEnum(ProductStatus)
  status: ProductStatus;
}
