import { IsString, IsOptional, IsBoolean, IsMongoId } from 'class-validator'

export class CreateCategoryDTO {
  @IsString()
  name: string

  @IsOptional()
  @IsMongoId()
  parentCategory?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsMongoId()
  parentCategory?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class AddSubcategoryDTO {
  @IsMongoId()
  subcategoryId: string
}

export class RemoveSubcategoryDTO {
  @IsMongoId()
  subcategoryId: string
}

export class FindCategoriesByFieldDTO {
    @IsString()
    field: string;
  
    @IsString()
    value: string;
  }
