import { IVehicle } from './vehicle.interface';
import { VehicleModel } from './vehicle.model';
import AppError from '../../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

const buildVehicleSignature = (data: IVehicle) => {
	const normalized = {
		type: (data.type || '').toString().trim().toLowerCase(),
		registration: (data.registration || '').toString().trim().toUpperCase(),
		make: (data.make || '').toString().trim().toLowerCase(),
		model: (data.model || '').toString().trim().toLowerCase(),
		year: Number(data.year || 0),
		motExpiry: (data.motExpiry || '').toString().trim(),
		roadTaxExpiry: (data.roadTaxExpiry || '').toString().trim(),
		insuranceExpiry: (data.insuranceExpiry || '').toString().trim(),
		serviceDue: (data.serviceDue || '').toString().trim(),
		breakdownCoverExpiry: (data.breakdownCoverExpiry || '').toString().trim(),
		vin: (data.vin || '').toString().trim().toUpperCase(),
		v5cDocumentNumber: (data.v5cDocumentNumber || '').toString().trim(),
		fuelType: (data.fuelType || '').toString().trim().toLowerCase(),
		bodyType: (data.bodyType || '').toString().trim().toLowerCase(),
		engineSize: (data.engineSize || '').toString().trim().toLowerCase(),
		engineCode: (data.engineCode || '').toString().trim().toUpperCase(),
		galleryImageHashes: Array.isArray(data.galleryImageHashes)
			? [...data.galleryImageHashes].map((x) => x.toString().trim()).sort()
			: [],
	};

	return crypto
		.createHash('sha256')
		.update(JSON.stringify(normalized))
		.digest('hex');
};

// Create a new vehicle
const createVehicle = async (data: IVehicle) => {
	const normalizedRegistration = (data.registration || '').trim().toUpperCase();
	const dataSignature = buildVehicleSignature({
		...data,
		registration: normalizedRegistration,
	});
	const vehicleData = { ...data, registration: normalizedRegistration, dataSignature };

	const existing = await VehicleModel.findOne({
		userId: data.userId,
		dataSignature,
	});
	if (existing) {
		throw new AppError(
			StatusCodes.CONFLICT,
			'Duplicate vehicle already added'
		);
	}
	try {
		const result = await VehicleModel.create(vehicleData);
		return result;
	} catch (error: any) {
		if (error?.code === 11000) {
			throw new AppError(
				StatusCodes.CONFLICT,
				`Vehicle with registration ${normalizedRegistration} already added`
			);
		}
		throw error;
	}
};

// Get all vehicles for a user (handles both new vehicles with userId and legacy ones)
const getVehiclesByUser = async (userId: string) => {
	const result = await VehicleModel.find({
		$or: [
			{ userId }, // New vehicles with userId field
			{ userId: { $exists: false } }, // Legacy vehicles without userId field
		],
	});
	return result;
};

// Get single vehicle by ID
const getSingleVehicle = async (id: string) => {
	const result = await VehicleModel.findById(id);
	return result;
};

// Update vehicle by ID
const updateVehicle = async (id: string, payload: Partial<IVehicle>) => {
	const { galleryImageEntriesToAdd, ...rest } = payload as Partial<IVehicle> & {
		galleryImageEntriesToAdd?: { path: string; hash: string }[];
	};

	const updateQuery: any = { $set: rest };

	if (galleryImageEntriesToAdd && galleryImageEntriesToAdd.length > 0) {
		const vehicle = await VehicleModel.findById(id).select('galleryImageHashes');
		const existingHashes = new Set<string>(vehicle?.galleryImageHashes || []);
		const filtered = galleryImageEntriesToAdd.filter((entry) => !existingHashes.has(entry.hash));

		if (filtered.length > 0) {
			updateQuery.$addToSet = {
				galleryImages: { $each: filtered.map((x) => x.path) },
				galleryImageHashes: { $each: filtered.map((x) => x.hash) },
			};
		}
	}

	const result = await VehicleModel.findByIdAndUpdate(id, updateQuery, {
		new: true,
		runValidators: true,
	});
	return result;
};

// Delete vehicle by ID
const deleteVehicle = async (id: string) => {
	const result = await VehicleModel.findByIdAndDelete(id);
	return result;
};

export const vehicleService = {
	createVehicle,
	getVehiclesByUser,
	getSingleVehicle,
	updateVehicle,
	deleteVehicle,
};
