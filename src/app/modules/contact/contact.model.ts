import mongoose, { Schema } from 'mongoose';
import { IContact } from './contact.interface';

const ContactSchema = new Schema<IContact>(
	{
		userId: { type: String, required: true, index: true },
		contactName: { type: String, required: true, trim: true },
		contactNumber: { type: String, required: true, trim: true },
		dataSignature: { type: String, required: true, index: true, select: false },
	},
	{ timestamps: true },
);

ContactSchema.index({ userId: 1, dataSignature: 1 }, { unique: true });

export const ContactModel = mongoose.model<IContact>('ContactModel', ContactSchema);
