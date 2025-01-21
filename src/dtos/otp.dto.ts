import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDTO {
    @IsString()
    @IsNotEmpty()
    userID: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(6, 6) 
    otp: string;
}
  

export class ResendOtpDTO {
  @IsString()
  @IsNotEmpty()
  userID: string;  
}