import { IsString, IsMongoId, IsOptional, IsArray } from 'class-validator';

export class SendMessageDTO {
  @IsString()
  message: string;

  @IsMongoId()
  senderId: string;

  @IsMongoId()
  receiverId: string;

  @IsMongoId()
  @IsOptional()
  productId?: string; // Optional: Message related to a specific product
}

export class GetMessagesDTO {
  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  senderId?: string; // Optional filter for messages sent by a specific user

  @IsMongoId()
  @IsOptional()
  receiverId?: string; // Optional filter for messages received by a specific user
}
