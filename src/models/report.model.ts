// src/models/Report.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IReport extends Document {
  user: mongoose.Types.ObjectId
  category: string
  title: string
  description: string
  attachmentUrl?: string
  status: string
  createdAt: Date
}

const ReportSchema: Schema = new Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['technical', 'transaction', 'report', 'violence', 'unethical', 'customer_service', 'delivery', 'other'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    attachmentUrl: { type: String },
    status: {
      type: String,
      enum: ['open', 'progress', 'resolved'],
      default: 'open',
    },
  },
  { timestamps: true }
)

export default mongoose.model<IReport>('Report', ReportSchema)
