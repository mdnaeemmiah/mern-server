import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { reportService } from './report.service';

const createReport = catchAsync(async (req: Request, res: Response) => {
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

	const files = (req as Request & { files?: Express.Multer.File[] }).files as
		| Express.Multer.File[]
		| undefined;
	const uploadedScenePhotos = Array.isArray(files)
		? files.filter((f) => f?.filename).map((f) => `/uploads/profile-images/${f.filename}`)
		: [];

	const bodyScenePhotos = Array.isArray(body.scenePhotos)
		? body.scenePhotos.filter((x: unknown) => typeof x === 'string' && x.trim().length > 0)
		: [];

	const reportData = {
		...body,
		userId,
		scenePhotos: [...bodyScenePhotos, ...uploadedScenePhotos],
	};

	const newReport = await reportService.createReport(reportData as any);

	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: 'Report created successfully!',
		data: {
			report: newReport,
			summary: reportService.buildReportSummary(newReport),
		},
	});
});

const getMyReports = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const reports = await reportService.getReportsByUser(userId);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Reports retrieved successfully',
		data: {
			items: reports.map((report) => ({
				report,
				summary: reportService.buildReportSummary(report),
			})),
			total: reports.length,
		},
	});
});

const getSingleReport = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const { id } = req.params;
	const report = await reportService.getSingleReport(id, userId);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Report retrieved successfully',
		data: {
			report,
			summary: reportService.buildReportSummary(report),
		},
	});
});

const updateReport = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const { id } = req.params;
	const payload = req.body || {};

	const files = (req as Request & { files?: Express.Multer.File[] }).files as
		| Express.Multer.File[]
		| undefined;
	const uploadedScenePhotos = Array.isArray(files)
		? files.filter((f) => f?.filename).map((f) => `/uploads/profile-images/${f.filename}`)
		: [];

	const bodyScenePhotos = Array.isArray(payload.scenePhotos)
		? payload.scenePhotos.filter((x: unknown) => typeof x === 'string' && x.trim().length > 0)
		: [];

	if (uploadedScenePhotos.length > 0 || bodyScenePhotos.length > 0) {
		payload.scenePhotos = [...bodyScenePhotos, ...uploadedScenePhotos];
	}

	const updatedReport = await reportService.updateReport(id, userId, payload);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Report updated successfully',
		data: {
			report: updatedReport,
			summary: reportService.buildReportSummary(updatedReport),
		},
	});
});

const deleteReport = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const { id } = req.params;
	const deletedReport = await reportService.deleteReport(id, userId);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Report deleted successfully',
		data: {
			report: deletedReport,
			summary: reportService.buildReportSummary(deletedReport),
		},
	});
});

const getReportSummary = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const { id } = req.params;
	const report = await reportService.getSingleReport(id, userId);

	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Report summary retrieved successfully',
		data: {
			report,
			summary: reportService.buildReportSummary(report),
		},
	});
});

export const reportController = {
	createReport,
	getMyReports,
	getSingleReport,
	updateReport,
	deleteReport,
	getReportSummary,
};

