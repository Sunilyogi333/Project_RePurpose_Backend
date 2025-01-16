import { IsString, IsNumber, IsOptional, IsArray, IsIn } from 'class-validator';

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

  @IsIn(['draft', 'published', 'archived'])
  status: 'draft' | 'published' | 'archived';
}
