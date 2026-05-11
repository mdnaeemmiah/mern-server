import mongoose, { Schema } from 'mongoose';
import { IReport } from './report.interface';

const ReportSchema = new Schema<IReport>(
	{
		userId: { type: String, required: true, index: true },
		accidentDateTime: { type: Date, default: Date.now, index: true },
		location: { type: String, trim: true },
		incidentDetails: { type: String, trim: true },
		weatherConditions: { type: String, trim: true },
		roadConditions: { type: String, trim: true },
		damageDescription: { type: String, trim: true },
		injuries: { type: Boolean, default: false },
		policeAttended: { type: Boolean, default: false },
		thirdParties: {
			type: [
				{
					fullName: { type: String, required: true, trim: true },
					phoneNumber: { type: String, trim: true },
					emailAddress: { type: String, trim: true },
					registration: { type: String, trim: true },
					make: { type: String, trim: true },
					model: { type: String, trim: true },
					insuranceCompany: { type: String, trim: true },
					policyNumber: { type: String, trim: true },
				},
			],
			default: [],
		},
		witnesses: {
			type: [
				{
					fullName: { type: String, required: true, trim: true },
					phoneNumber: { type: String, trim: true },
					emailAddress: { type: String, trim: true },
					statement: { type: String, trim: true },
				},
			],
			default: [],
		},
		scenePhotos: { type: [String], default: [] },
	},
	{ timestamps: true },
);

export const ReportModel = mongoose.model<IReport>('ReportModel', ReportSchema);

