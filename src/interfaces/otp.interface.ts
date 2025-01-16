import { Document, Schema } from 'mongoose'

// Define the interface for OTP
export interface IOTP extends Document {
  userId: Schema.Types.ObjectId
  otp: string
  expiresAt: Date
  createdAt?: Date // Automatically managed by Mongoose
  updatedAt?: Date // Automatically managed by Mongoose

  // Methods
  isOtpCorrect(otp: string): Promise<boolean>
}
