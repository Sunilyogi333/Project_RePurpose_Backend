import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  oldPassword: string

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  newPassword: string
}
