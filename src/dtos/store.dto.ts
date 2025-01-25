import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  ValidateNested,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

// Address DTO
class AddressDTO {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 10)
  postalCode: string;
}

// Create Store DTO
export class CreateStoreDTO {
  @IsMongoId()
  userID: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  storeName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  ownerName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 15)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  passportPhoto: string;

  @IsString()
  @IsNotEmpty()
  businessRegNumber: string;

  @ValidateNested()
  @Type(() => AddressDTO)
  storeAddress: AddressDTO;

  @IsString()
  @IsNotEmpty()
  ownerGovernmentID: string;

  @IsString()
  @IsNotEmpty()
  businessRegCertificate: string;

  @IsString()
  @IsOptional()
  storefrontImage?: string;
}

// Update Store DTO
export class UpdateStoreDTO extends CreateStoreDTO {}
