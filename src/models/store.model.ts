import { Schema, model } from 'mongoose'
import {IStore} from '../interfaces/store.interface'

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
      passportPhoto: {
        type: String,
        required: true,
      },
      businessRegistrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      storeAddress: {
        country: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        postalCode: {
          type: String,
          required: true,
          trim: true,
        },
      },
      ownerGovernmentID: {
        type: String,
        required: true,
      },
      businessRegistrationCertificate: {
        type: String,
        required: true,
      },
      storefrontImage: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
);
  
// Export the Store model
const Store = model<IStore>('Store', storeSchema);
export default Store;