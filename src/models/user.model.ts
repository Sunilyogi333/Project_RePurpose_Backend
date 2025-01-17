import { Schema, model, Document } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import { ROLE } from '../constants/enum'
import { BcryptService } from '../utils/bcrypt.utils'
import { TokenService } from '../services/token.service'

// Define the User Schema
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true,
    },
    lastName: {
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
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; 
      },
      minlength: 4,
      maxlength: 1024,
    },
    googleId: {
      type: String,
      unique: true,
      sparse:true,
    },
    profileImage: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: [ROLE.MEMBER, ROLE.SELLER, ROLE.ADMIN],
      default: ROLE.SELLER,
    },
    storeName: {
      type: String,
    },
    isGoogleUser: { type: Boolean, default: false }, 

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
    },
    totalRewardPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await BcryptService.hash(this.password)
  }
  next()
})

// Method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return BcryptService.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (): string {
  return TokenService.generateAccessToken(this as IUser)
}

userSchema.methods.generateRefreshToken = function (): string {
  return TokenService.generateRefreshToken(this as IUser)
}

// Export the User model
const User = model<IUser>('User', userSchema)
export default User
