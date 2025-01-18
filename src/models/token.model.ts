import mongoose, { Document, Schema, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { EnvironmentConfiguration } from "../config/env.config";

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  uniqueString: string;
  createdAt: Date;
  expiresAt: Date;
  generateToken(): string;
  isUniqueStringCorrect(uniqueString: string): Promise<boolean>;
}

const tokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uniqueString: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

tokenSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.uniqueString = await bcrypt.hash(this.uniqueString, 10);
  }
  next();
});

tokenSchema.methods.generateToken = function (): string {
  return jwt.sign(
    { userId: this.userId, uniqueString: this.uniqueString },
    EnvironmentConfiguration.VERIFICATION_TOKEN_SECRET,
    { expiresIn: EnvironmentConfiguration.VERIFICATION_TOKEN_EXPIRES_IN }
  );
};

tokenSchema.methods.isUniqueStringCorrect = async function (uniqueString: string): Promise<boolean> {
  return bcrypt.compare(uniqueString, this.uniqueString);
};

const Token: Model<IToken> = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
