import mongoose, { Schema } from 'mongoose';
import { IVehicle } from './vehicle.interface';

const VehicleSchema = new Schema<IVehicle>({
	userId: { type: String, required: true, index: true },
	type: { type: String, enum: ['car', 'van', 'bike', 'hgv'], required: true },
	registration: { type: String, required: true },
	make: { type: String, required: true },
	model: { type: String, required: true },
	year: { type: Number, required: true },
	dataSignature: { type: String, required: true, index: true, select: false },
	motExpiry: { type: String },
	roadTaxExpiry: { type: String },
	insuranceExpiry: { type: String },
	serviceDue: { type: String },
	breakdownCoverExpiry: { type: String },
	vin: { type: String },
	v5cDocumentNumber: { type: String },
	fuelType: { type: String },
	bodyType: { type: String },
	engineSize: { type: String },
	engineCode: { type: String },
	galleryImages: { type: [String], default: [] },
	galleryImageHashes: { type: [String], default: [], select: false },
}, { timestamps: true });

VehicleSchema.index({ userId: 1, registration: 1 }, { unique: true });
VehicleSchema.index({ userId: 1, dataSignature: 1 }, { unique: true });

export const VehicleModel = mongoose.model<IVehicle>('VehicleModel', VehicleSchema);
