// CreateNotificationDTO.ts
import { IsArray, IsString } from 'class-validator';

export class CreateNotificationDTO {
  @IsString()
  message: string;

  @IsString()
  productId: string;

  @IsArray()
  userIds: string[];
}

export class MarkAsReadDTO {
  @IsString()
  notificationId: string;
}
