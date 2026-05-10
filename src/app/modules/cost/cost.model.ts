import mongoose, { Schema } from 'mongoose';
import { ICost } from './cost.interface';

const CostSchema = new Schema<ICost>(
	{
		userId: { type: String, required: true, index: true },
		amount: { type: Number, required: true },
		purpose: { type: String, required: true },
		entryDate: { type: Date, default: Date.now, index: true },
		dataSignature: { type: String, required: true, index: true, select: false },
	},
	{ timestamps: true },
);

CostSchema.index({ userId: 1, dataSignature: 1 }, { unique: true });

export const CostModel = mongoose.model<ICost>('CostModel', CostSchema);
