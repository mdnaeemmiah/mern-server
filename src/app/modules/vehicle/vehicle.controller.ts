import { Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { vehicleService } from './vehicle.service';

// Create a new vehicle
const createVehicle = catchAsync(async (req: Request, res: Response) => {
	// Ensure we have a body object (multer sets req.body for multipart)
	const body = req.body || {};

	// Remove userId if someone sent it
	if ('userId' in body) delete body.userId;

	// Get authenticated user id from req.user (set by auth middleware)
	// req.user is full user document, _id is ObjectId, convert to string
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	// Handle uploaded files (galleryImages) with hash-based dedupe
	const files = (req as Request & { files?: Express.Multer.File[] }).files as
		| Express.Multer.File[]
		| undefined;
	const galleryImages: string[] = [];
	const galleryImageHashes: string[] = [];
	if (files && Array.isArray(files)) {
		const seen = new Set<string>();
		for (const f of files) {
			if (f && f.filename) {
				const filePath = path.join(process.cwd(), 'uploads', 'profile-images', f.filename);
				const fileBuffer = fs.readFileSync(filePath);
				const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
				if (!seen.has(hash)) {
					seen.add(hash);
					galleryImages.push(`/uploads/profile-images/${f.filename}`);
					galleryImageHashes.push(hash);
				}
			}
		}
	}

	const vehicleData = {
		...body,
		userId,
		...(galleryImages.length > 0 ? { galleryImages } : {}),
		...(galleryImageHashes.length > 0 ? { galleryImageHashes } : {}),
	};

	const newVehicle = await vehicleService.createVehicle(vehicleData as any);
	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: 'Vehicle created successfully!',
		data: newVehicle,
	});
});

// Get all vehicles for a specific user (by userId param)
const getVehiclesByUser = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.params;
	const vehicles = await vehicleService.getVehiclesByUser(userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Vehicles retrieved successfully',
		data: vehicles,
	});
});

// Get all vehicles for current authenticated user (from token)
const getMyVehicles = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}
	const vehicles = await vehicleService.getVehiclesByUser(userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Your vehicles retrieved successfully',
		data: vehicles,
	});
});

// Get single vehicle by ID
const getSingleVehicle = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const vehicle = await vehicleService.getSingleVehicle(id);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Vehicle retrieved successfully',
		data: vehicle,
	});
});

// Update vehicle
const updateVehicle = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const payload = req.body || {};

	// Handle uploaded files (galleryImages) with hash-based dedupe
	const files = (req as Request & { files?: Express.Multer.File[] }).files as
		| Express.Multer.File[]
		| undefined;
	const galleryImages: string[] = [];
	const galleryImageHashes: string[] = [];
	if (files && Array.isArray(files)) {
		const seen = new Set<string>();
		for (const f of files) {
			if (f && f.filename) {
				const filePath = path.join(process.cwd(), 'uploads', 'profile-images', f.filename);
				const fileBuffer = fs.readFileSync(filePath);
				const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
				if (!seen.has(hash)) {
					seen.add(hash);
					galleryImages.push(`/uploads/profile-images/${f.filename}`);
					galleryImageHashes.push(hash);
				}
			}
		}
	}

	if (galleryImages.length > 0) {
		payload.galleryImageEntriesToAdd = galleryImages.map((img, idx) => ({
			path: img,
			hash: galleryImageHashes[idx],
		}));
	}

	const updatedVehicle = await vehicleService.updateVehicle(id, payload);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Vehicle updated successfully',
		data: updatedVehicle,
	});
});

// Delete vehicle
const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const deletedVehicle = await vehicleService.deleteVehicle(id);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Vehicle deleted successfully',
		data: deletedVehicle,
	});
});

export const vehicleController = {
	createVehicle,
	getVehiclesByUser,
	getMyVehicles,
	getSingleVehicle,
	updateVehicle,
	deleteVehicle,
};
