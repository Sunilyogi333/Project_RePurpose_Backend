import { Document, Types } from 'mongoose'

export interface IStore extends Document {
  userID: Types.ObjectId // Reference to the User model
  storeName: string
  ownerName: string
  email: string
  phoneNumber: string
  storeAddress: string
  storeNumber: string
  status: string
  businessRegNumber: string
  passportPhoto: string
  storeFrontImage: string
  businessRegCertificate: string
  createdAt?: Date
  updatedAt?: Date
}
