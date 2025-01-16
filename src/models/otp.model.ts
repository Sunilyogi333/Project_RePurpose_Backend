import { Schema, model, Document } from 'mongoose'
import { IOTP } from '../interfaces/otp.interface'
import { BcryptService } from '../utils/bcrypt.utils'

const otpSchema = new Schema<IOTP>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

//index to expire OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Middleware to hash the OTP before saving
otpSchema.pre<IOTP>('save', async function (next) {
  if (this.isNew) {
    this.otp = await BcryptService.hash(this.otp)
  }
  next()
})

// Instance method to compare OTPs
otpSchema.methods.isOtpCorrect = async function (otp: string): Promise<boolean> {
  return BcryptService.compare(otp, this.otp)
}

// Create and export the model
const OTP = model<IOTP>('OTP', otpSchema)

export default OTP
