import { Schema, model } from 'mongoose'
import { IStore } from '../interfaces/store.interface'
import { SELLER_KYC_STATUS } from '../constants/enum'

// Define the Store Schema
const storeSchema = new Schema<IStore>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeName: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      maxlength: 15,
      trim: true,
    },
    storeNumber: {
      type: String,
      required: true,
      maxlength: 40,
      trim: true,
    },
    status: {
      type: String,
      enum: [SELLER_KYC_STATUS.APPROVED, SELLER_KYC_STATUS.REJECTED, SELLER_KYC_STATUS.PENDING],
      default: SELLER_KYC_STATUS.PENDING,
    },
    storeAddress: {
      type: String,
      required: true,
      unique: true,
    },
    businessRegNumber: {
      type: String,
      required: true,
      trim: true,
      sparse: true, 
    },
    passportPhoto: {
      type: String,
      required: true,
    },
    businessRegCertificate: {
      type: String,
      required: true,
    },
    storeFrontImage: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Export the Store model
const Store = model<IStore>('Store', storeSchema)
export default Store
