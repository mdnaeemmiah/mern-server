import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { costService } from './cost.service';

const getParam = (value: string | string[] | undefined): string =>
	(Array.isArray(value) ? value[0] : value) || '';

const createCost = catchAsync(async (req: Request, res: Response) => {
	const body = req.body || {};

	if ('userId' in body) delete body.userId;

	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const costData = {
		...body,
		userId,
	};

	const newCost = await costService.createCost(costData as any);
	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: 'Cost created successfully!',
		data: newCost,
	});
});

const getMyCosts = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const costs = await costService.getCostsByUser(userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Costs retrieved successfully',
		data: costs,
	});
});

const getSingleCost = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const id = getParam(req.params.id);
	const cost = await costService.getSingleCost(id, userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Cost retrieved successfully',
		data: cost,
	});
});

const updateCost = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const id = getParam(req.params.id);
	const payload = req.body || {};
	const updatedCost = await costService.updateCost(id, userId, payload);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Cost updated successfully',
		data: updatedCost,
	});
});

const deleteCost = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const id = getParam(req.params.id);
	const deletedCost = await costService.deleteCost(id, userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Cost deleted successfully',
		data: deletedCost,
	});
});

const getCostSummary = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const period = (req.query.period || 'daily').toString();
	const summary = await costService.getCostSummary(userId, period);
	const yearlySummary = await costService.getCostSummary(userId, 'yearly');
	const monthlySummary = await costService.getCostSummary(userId, 'monthly');
	const weeklySummary = await costService.getCostSummary(userId, 'weekly');
	const dailySummary = await costService.getCostSummary(userId, 'daily');

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Cost summary retrieved successfully',
		data: {
			period: summary.period,
			card: {
				totalRunningCosts: summary.totalRunningCosts,
				totalEntries: summary.totalEntries,
				averageDailyCost: summary.averageDailyCost,
				basedOnDays: summary.dayCount,
				averageCostPerEntry: summary.averageCostPerEntry,
			},
			spendingTrend: summary.trend,
			dailySpendingTrend: dailySummary.trend,
			weeklySpendingTrend: weeklySummary.trend,
			monthlySpendingTrend: monthlySummary.trend,
			yearlySpendingTrend: yearlySummary.trend,
		},
	});
});

export const costController = {
	createCost,
	getMyCosts,
	getSingleCost,
	updateCost,
	deleteCost,
	getCostSummary,
};
