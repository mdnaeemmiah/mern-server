import { IDocument } from './documents.interface';
import { DocumentModel } from './documents.model';
import crypto from 'crypto';
import AppError from '../../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const buildDocumentSignature = (data: IDocument) => {
	const normalized = {
		title: (data.title || '').toString().trim().toLowerCase(),
		fileHashes: Array.isArray(data.fileHashes)
			? [...data.fileHashes].map((x) => x.toString().trim()).sort()
			: [],
	};

	return crypto
		.createHash('sha256')
		.update(JSON.stringify(normalized))
		.digest('hex');
};

const createDocument = async (data: IDocument) => {
	const dataSignature = buildDocumentSignature(data);
	const documentData = { ...data, dataSignature };

	const existing = await DocumentModel.findOne({
		userId: data.userId,
		dataSignature,
	});
	if (existing) {
		throw new AppError(
			StatusCodes.CONFLICT,
			'Duplicate document already added',
		);
	}

	const result = await DocumentModel.create(documentData);
	return result;
};

const getDocumentsByUser = async (userId: string) => {
	const result = await DocumentModel.find({ userId });
	return result;
};

const getSingleDocument = async (id: string, userId: string) => {
	const result = await DocumentModel.findOne({ _id: id, userId });
	return result;
};

const updateDocument = async (
	id: string,
	userId: string,
	payload: Partial<IDocument>,
) => {
	const { fileEntriesToAdd, ...rest } = payload as Partial<IDocument> & {
		fileEntriesToAdd?: { path: string; hash: string }[];
	};

	const updateQuery: any = { $set: rest };

	if (fileEntriesToAdd && fileEntriesToAdd.length > 0) {
		const document = await DocumentModel.findOne({ _id: id, userId }).select(
			'fileHashes',
		);
		const existingHashes = new Set<string>(document?.fileHashes || []);
		const filtered = fileEntriesToAdd.filter(
			(entry) => !existingHashes.has(entry.hash),
		);

		if (filtered.length > 0) {
			updateQuery.$addToSet = {
				files: { $each: filtered.map((x) => x.path) },
				fileHashes: { $each: filtered.map((x) => x.hash) },
			};
		}
	}

	const result = await DocumentModel.findOneAndUpdate(
		{ _id: id, userId },
		updateQuery,
		{
			new: true,
			runValidators: true,
		},
	);
	return result;
};

const deleteDocument = async (id: string, userId: string) => {
	const result = await DocumentModel.findOneAndDelete({ _id: id, userId });
	return result;
};

export const documentsService = {
	createDocument,
	getDocumentsByUser,
	getSingleDocument,
	updateDocument,
	deleteDocument,
};
