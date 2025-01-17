import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsMongoId } from 'class-validator'
import { Transform } from 'class-transformer'

import { PRODUCT_STATUS as ProductStatus } from '../constants/enum'

export class CreateProductDTO {
  @IsString()
  name: string

  @IsString()
  description: string

  // @Transform(({ value }) => parseFloat(value), { toClassOnly: true }) // Apply transformation to the class instance
  // @IsNumber({}, { message: 'Price must be a number' }) // Validate after transformation
  @IsString()
  price: number

  @IsArray()
  @IsOptional()
  images: string[] // URLs of uploaded images

  @IsString()
  @IsOptional()
  category: string

  @IsEnum(ProductStatus)
  status: ProductStatus

  @IsOptional()
  @IsMongoId()
  seller: string
}
