// dtos/user.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsPhoneNumber,
  IsIn,
} from 'class-validator'
import { ROLE } from '../constants/enum'

// DTO for User Registration
export class RegisterUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  // @IsPhoneNumber() // Assuming you want to validate it as a proper phone number
  phoneNumber: string

  @IsString()
  storeName: string

  @IsString()
  address: string

  @IsString()
  role: string
}

// DTO for Updating User Information
export class EditUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsOptional()
  // @IsPhoneNumber()
  phoneNumber?: string
}

// DTO for User Verification
export class VerifyUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsBoolean()
  isEmailVerified: boolean
}

export class CompleteProfileDTO {
  @IsString()
  userId: string

  @IsString()
  phoneNumber: string

  @IsString()
  @IsIn(['Store', 'Member'])
  role: string

  @IsOptional()
  @IsString()
  storeName?: string
}

export class UpdateProfilePictureDTO {
  @IsString()
  @IsNotEmpty({ message: 'Profile picture path is required' })
  profilePicture!: string;
}
