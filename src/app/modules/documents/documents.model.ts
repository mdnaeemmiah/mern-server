import mongoose, { Schema } from 'mongoose';
import { IDocument } from './documents.interface';

const DocumentSchema = new Schema<IDocument>(
	{
		userId: { type: String, required: true, index: true },
		title: { type: String, required: true },
		files: { type: [String], default: [] },
		fileHashes: { type: [String], default: [], select: false },
		dataSignature: { type: String, required: true, index: true, select: false },
	},
	{ timestamps: true },
);

DocumentSchema.index({ userId: 1, dataSignature: 1 }, { unique: true });

export const DocumentModel = mongoose.model<IDocument>(
	'DocumentModel',
	DocumentSchema,
);
