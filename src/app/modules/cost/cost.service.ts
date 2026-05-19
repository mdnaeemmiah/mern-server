import { ICost } from './cost.interface';
import { CostModel } from './cost.model';
import { Types } from 'mongoose';
import crypto from 'crypto';
import AppError from '../../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { VehicleModel } from '../vehicle/vehicle.model';

const assertVehicleOwnership = async (vehicleId: string, userId: string) => {
	if (!Types.ObjectId.isValid(vehicleId)) {
		throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid vehicle id');
	}

	const vehicle = await VehicleModel.findOne({
		_id: vehicleId,
		$or: [{ userId }, { userId: { $exists: false } }, { userId: null }, { userId: '' }],
	});

	if (!vehicle) {
		throw new AppError(StatusCodes.NOT_FOUND, 'Vehicle not found');
	}
};

const buildCostSignature = (data: ICost) => {
	const entryDate = data.entryDate ? new Date(data.entryDate) : new Date();
	const dateOnly = entryDate.toISOString().slice(0, 10);

	const normalized = {
		vehicleId: (data.vehicleId || '').toString().trim(),
		amount: Number(data.amount || 0),
		purpose: (data.purpose || '').toString().trim().toLowerCase(),
		entryDate: dateOnly,
	};

	return crypto
		.createHash('sha256')
		.update(JSON.stringify(normalized))
		.digest('hex');
};

const createCost = async (data: ICost) => {
	if (!data.vehicleId) {
		throw new AppError(StatusCodes.BAD_REQUEST, 'vehicleId is required');
	}

	await assertVehicleOwnership(data.vehicleId, data.userId as string);

	const entryDate = data.entryDate ? new Date(data.entryDate) : new Date();
	const dataSignature = buildCostSignature({ ...data, entryDate });
	const costData = { ...data, entryDate, dataSignature };

	const existing = await CostModel.findOne({
		userId: data.userId,
		vehicleId: data.vehicleId,
		dataSignature,
	});
	if (existing) {
		throw new AppError(StatusCodes.CONFLICT, 'Duplicate cost already added');
	}

	const result = await CostModel.create(costData);
	return result;
};

const getCostsByUser = async (userId: string) => {
	const result = await CostModel.find({ userId }).sort({ entryDate: -1 });
	return result;
};

const getSingleCost = async (id: string, userId: string) => {
	if (!Types.ObjectId.isValid(id)) return null;
	const result = await CostModel.findOne({ _id: id, userId });
	return result;
};

const updateCost = async (id: string, userId: string, payload: Partial<ICost>) => {
	const result = await CostModel.findOneAndUpdate(
		{ _id: id, userId },
		payload,
		{
			new: true,
			runValidators: true,
		},
	);
	return result;
};

const deleteCost = async (id: string, userId: string) => {
	const result = await CostModel.findOneAndDelete({ _id: id, userId });
	return result;
};

const getDateRange = (period: string) => {
	const now = new Date();
	const end = new Date(now);
	let start = new Date(now);

	if (period === 'weekly') {
		start.setDate(now.getDate() - 6);
	} else if (period === 'monthly') {
		start = new Date(now.getFullYear(), now.getMonth(), 1);
	} else if (period === 'yearly') {
		start = new Date(now.getFullYear(), 0, 1);
	} else {
		start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	start.setHours(0, 0, 0, 0);
	end.setHours(23, 59, 59, 999);
	return { start, end };
};

const getGroupFormat = (period: string) => {
	if (period === 'weekly') return { $isoWeek: '$entryDate' };
	if (period === 'monthly') return { $month: '$entryDate' };
	if (period === 'yearly') return { $year: '$entryDate' };
	return { $dateToString: { format: '%Y-%m-%d', date: '$entryDate' } };
};

const formatTrendLabel = (period: string, value: any) => {
	if (period === 'weekly') return `Week ${value}`;
	if (period === 'monthly') return `Month ${value}`;
	if (period === 'yearly') return `${value}`;
	return `${value}`;
};

const getCostSummary = async (userId: string, period: string) => {
	const { start, end } = getDateRange(period);

	const matchStage = {
		userId,
		entryDate: { $gte: start, $lte: end },
	};

	const totals = await CostModel.aggregate([
		{ $match: matchStage },
		{
			$group: {
				_id: null,
				totalRunningCosts: { $sum: '$amount' },
				count: { $sum: 1 },
			},
		},
	]);

	const trendRaw = await CostModel.aggregate([
		{ $match: matchStage },
		{
			$group: {
				_id: getGroupFormat(period),
				total: { $sum: '$amount' },
			},
		},
		{ $sort: { _id: 1 } },
	]);

	const totalRunningCosts = totals?.[0]?.totalRunningCosts || 0;
	const totalEntries = totals?.[0]?.count || 0;
	const dayCount =
		period === 'weekly'
			? 7
			: period === 'monthly'
				? 30
				: period === 'yearly'
					? 365
					: 1;
	const averageDailyCost = totalRunningCosts / dayCount;
	const averageCostPerEntry = totalEntries > 0 ? totalRunningCosts / totalEntries : 0;
	const trend = trendRaw.map((item: { _id: any; total: number }) => ({
		label: formatTrendLabel(period, item._id),
		value: item.total,
	}));

	return {
		period,
		range: { start, end },
		totalRunningCosts,
		totalEntries,
		averageCostPerEntry,
		averageDailyCost,
		dayCount,
		trend,
	};
};

export const costService = {
	createCost,
	getCostsByUser,
	getSingleCost,
	updateCost,
	deleteCost,
	getCostSummary,
};
