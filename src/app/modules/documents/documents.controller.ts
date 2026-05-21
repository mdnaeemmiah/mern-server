import { Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { documentsService } from './documents.service';

const getParam = (value: string | string[] | undefined): string =>
	(Array.isArray(value) ? value[0] : value) || '';

const createDocument = catchAsync(async (req: Request, res: Response) => {
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
	const documentFiles: string[] = [];
	const documentFileHashes: string[] = [];
	if (files && Array.isArray(files)) {
		const seen = new Set<string>();
		for (const f of files) {
			if (f && f.filename) {
				const filePath = path.join(process.cwd(), 'uploads', 'documents', f.filename);
				const fileBuffer = fs.readFileSync(filePath);
				const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
				if (!seen.has(hash)) {
					seen.add(hash);
					documentFiles.push(`/uploads/documents/${f.filename}`);
					documentFileHashes.push(hash);
				}
			}
		}
	}

	const documentData = {
		...body,
		userId,
		...(documentFiles.length > 0 ? { files: documentFiles } : {}),
		...(documentFileHashes.length > 0 ? { fileHashes: documentFileHashes } : {}),
	};

	const newDocument = await documentsService.createDocument(documentData as any);
	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: 'Document created successfully!',
		data: newDocument,
	});
});

const getMyDocuments = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const documents = await documentsService.getDocumentsByUser(userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Documents retrieved successfully',
		data: documents,
	});
});

const getSingleDocument = catchAsync(async (req: Request, res: Response) => {
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
	const document = await documentsService.getSingleDocument(id, userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Document retrieved successfully',
		data: document,
	});
});

const updateDocument = catchAsync(async (req: Request, res: Response) => {
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

	const files = (req as Request & { files?: Express.Multer.File[] }).files as
		| Express.Multer.File[]
		| undefined;
	const documentFiles: string[] = [];
	const documentFileHashes: string[] = [];
	if (files && Array.isArray(files)) {
		const seen = new Set<string>();
		for (const f of files) {
			if (f && f.filename) {
				const filePath = path.join(process.cwd(), 'uploads', 'documents', f.filename);
				const fileBuffer = fs.readFileSync(filePath);
				const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
				if (!seen.has(hash)) {
					seen.add(hash);
					documentFiles.push(`/uploads/documents/${f.filename}`);
					documentFileHashes.push(hash);
				}
			}
		}
	}

	if (documentFiles.length > 0) {
		payload.fileEntriesToAdd = documentFiles.map((doc, idx) => ({
			path: doc,
			hash: documentFileHashes[idx],
		}));
	}

	const updatedDocument = await documentsService.updateDocument(id, userId, payload);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Document updated successfully',
		data: updatedDocument,
	});
});

const deleteDocument = catchAsync(async (req: Request, res: Response) => {
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
	const deletedDocument = await documentsService.deleteDocument(id, userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Document deleted successfully',
		data: deletedDocument,
	});
});

export const documentsController = {
	createDocument,
	getMyDocuments,
	getSingleDocument,
	updateDocument,
	deleteDocument,
};
