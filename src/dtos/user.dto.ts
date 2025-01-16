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
  @MaxLength(255)
  firstName: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lastName: string

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(1024)
  password: string

  @IsNotEmpty()
  @IsPhoneNumber() // Assuming you want to validate it as a proper phone number
  phoneNumber: string
}

// DTO for Updating User Information
export class UpdateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  firstName: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lastName: string

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  profileImage?: string

  @IsOptional()
  @IsEnum(ROLE)
  role?: ROLE

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean

  @IsOptional()
  @IsNumber()
  totalRewardPoints?: number
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
