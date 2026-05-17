import { IVehicle } from './vehicle.interface';
import { VehicleModel } from './vehicle.model';
import AppError from '../../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import mongoose from 'mongoose';

const getUserIdCandidates = (userId: string) => {
	const candidates: Array<string | mongoose.Types.ObjectId> = [userId];
	if (mongoose.Types.ObjectId.isValid(userId)) {
		candidates.push(new mongoose.Types.ObjectId(userId));
	}
	return candidates;
};

const buildVehicleOwnershipQuery = (userId: string) => {
	const userIdCandidates = getUserIdCandidates(userId);
	return {
		$or: [
			{ userId: { $in: userIdCandidates } },
			{ userId: { $exists: false } },
			{ userId: null },
			{ userId: '' },
		],
	};
};

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
		color: (data.color || '').toString().trim().toLowerCase(),
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
	const normalizedRegistrationRaw = (data.registration || '').trim().toUpperCase();
	const normalizedRegistration = normalizedRegistrationRaw || undefined;

	if (normalizedRegistration) {
		const duplicateByRegistration = await VehicleModel.findOne({
			userId: data.userId,
			registration: normalizedRegistration,
		});

		if (duplicateByRegistration) {
			throw new AppError(
				StatusCodes.CONFLICT,
				`Vehicle with registration ${normalizedRegistration} already added`
			);
		}
	}

	const dataSignature = buildVehicleSignature({
		...data,
		registration: normalizedRegistration || '',
	});
	const vehicleData = {
		...data,
		...(normalizedRegistration ? { registration: normalizedRegistration } : {}),
		dataSignature,
	};

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
			const duplicateMsg = error?.keyPattern?.registration
				? `Vehicle with registration ${normalizedRegistration || data.registration} already added`
				: 'Vehicle already added';
			throw new AppError(
				StatusCodes.CONFLICT,
				duplicateMsg
			);
		}
		throw error;
	}
};

// Get all vehicles for a user
const getVehiclesByUser = async (userId: string, includeLegacy = false) => {
	const userIdCandidates = getUserIdCandidates(userId);
	const query = includeLegacy
		? {
			$or: [
				{ userId: { $in: userIdCandidates } },
				{ userId: { $exists: false } },
				{ userId: null },
				{ userId: '' },
			],
		}
		: { userId: { $in: userIdCandidates } };

	const result = await VehicleModel.find(query);
	return result;
};

// Get single vehicle by ID
const getSingleVehicle = async (id: string, userId: string) => {
	const result = await VehicleModel.findOne({
		_id: id,
		...buildVehicleOwnershipQuery(userId),
	});
	if (!result) {
		throw new AppError(StatusCodes.NOT_FOUND, 'Vehicle not found');
	}
	return result;
};

// Update vehicle by ID
const updateVehicle = async (id: string, payload: Partial<IVehicle>, userId: string) => {
	const { galleryImageEntriesToAdd, ...rest } = payload as Partial<IVehicle> & {
		galleryImageEntriesToAdd?: { path: string; hash: string }[];
	};

	const existingVehicle = await VehicleModel.findOne({
		_id: id,
		...buildVehicleOwnershipQuery(userId),
	}).select('+galleryImageHashes');
	if (!existingVehicle) {
		throw new AppError(StatusCodes.NOT_FOUND, 'Vehicle not found');
	}

	const updateSet: Record<string, unknown> = { ...rest };
	if (!existingVehicle.userId) {
		updateSet.userId = userId;
	}
	if (typeof updateSet.registration === 'string') {
		updateSet.registration = updateSet.registration.trim().toUpperCase();
	}

	const updateQuery: any = { $set: updateSet };
	const existingHashes = new Set<string>(existingVehicle?.galleryImageHashes || []);
	let filtered: { path: string; hash: string }[] = [];

	if (galleryImageEntriesToAdd && galleryImageEntriesToAdd.length > 0) {
		filtered = galleryImageEntriesToAdd.filter((entry) => !existingHashes.has(entry.hash));

		if (filtered.length > 0) {
			updateQuery.$addToSet = {
				galleryImages: { $each: filtered.map((x) => x.path) },
				galleryImageHashes: { $each: filtered.map((x) => x.hash) },
			};
		}
	}

	const mergedForSignature: IVehicle = {
		...existingVehicle.toObject(),
		...updateSet,
		galleryImageHashes: [...existingHashes, ...filtered.map((x) => x.hash)],
	};
	updateQuery.$set.dataSignature = buildVehicleSignature(mergedForSignature);

	const result = await VehicleModel.findOneAndUpdate({
		_id: id,
		...buildVehicleOwnershipQuery(userId),
	}, updateQuery, {
		new: true,
		runValidators: true,
	});

	if (!result) {
		throw new AppError(StatusCodes.NOT_FOUND, 'Vehicle not found');
	}
	return result;
};

// Delete vehicle by ID
const deleteVehicle = async (id: string, userId: string) => {
	const result = await VehicleModel.findOneAndDelete({
		_id: id,
		...buildVehicleOwnershipQuery(userId),
	});
	if (!result) {
		throw new AppError(StatusCodes.NOT_FOUND, 'Vehicle not found');
	}
	return result;
};

export const vehicleService = {
	createVehicle,
	getVehiclesByUser,
	getSingleVehicle,
	updateVehicle,
	deleteVehicle,
};
