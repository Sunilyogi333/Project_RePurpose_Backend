import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDTO {
    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(6, 6) 
    otp: string;
  }