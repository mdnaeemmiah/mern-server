import crypto from 'crypto';
import { Types } from 'mongoose';
import AppError from '../../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { IContact } from './contact.interface';
import { ContactModel } from './contact.model';

const normalizeContactNumber = (value: string) =>
	value
		.toString()
		.trim()
		.replace(/[\s\-()]/g, '');

const buildContactSignature = (data: IContact) => {
	const normalized = {
		contactName: (data.contactName || '').toString().trim().toLowerCase(),
		contactNumber: normalizeContactNumber((data.contactNumber || '').toString()),
	};

	return crypto
		.createHash('sha256')
		.update(JSON.stringify(normalized))
		.digest('hex');
};

const createContact = async (data: IContact) => {
	const dataSignature = buildContactSignature(data);
	const contactData = { ...data, dataSignature };

	const existing = await ContactModel.findOne({
		userId: data.userId,
		dataSignature,
	});

	if (existing) {
		throw new AppError(StatusCodes.CONFLICT, 'Duplicate contact already added');
	}

	try {
		const result = await ContactModel.create(contactData);
		return result;
	} catch (error: any) {
		if (error?.code === 11000) {
			throw new AppError(StatusCodes.CONFLICT, 'Duplicate contact already added');
		}
		throw error;
	}
};

const getContactsByUser = async (userId: string) => {
	const result = await ContactModel.find({ userId }).sort({ createdAt: -1 });
	return result;
};

const getSingleContact = async (id: string, userId: string) => {
	if (!Types.ObjectId.isValid(id)) return null;
	const result = await ContactModel.findOne({ _id: id, userId });
	return result;
};

const updateContact = async (
	id: string,
	userId: string,
	payload: Partial<IContact>,
) => {
	if (!Types.ObjectId.isValid(id)) return null;

	const existing = await ContactModel.findOne({ _id: id, userId });
	if (!existing) return null;

	const merged = {
		...existing.toObject(),
		...payload,
	};
	const dataSignature = buildContactSignature(merged as IContact);

	const duplicate = await ContactModel.findOne({
		_id: { $ne: id },
		userId,
		dataSignature,
	});

	if (duplicate) {
		throw new AppError(StatusCodes.CONFLICT, 'Duplicate contact already added');
	}

	try {
		const result = await ContactModel.findOneAndUpdate(
			{ _id: id, userId },
			{ ...payload, dataSignature },
			{
				new: true,
				runValidators: true,
			},
		);

		return result;
	} catch (error: any) {
		if (error?.code === 11000) {
			throw new AppError(StatusCodes.CONFLICT, 'Duplicate contact already added');
		}
		throw error;
	}
};

const deleteContact = async (id: string, userId: string) => {
	if (!Types.ObjectId.isValid(id)) return null;
	const result = await ContactModel.findOneAndDelete({ _id: id, userId });
	return result;
};

export const contactService = {
	createContact,
	getContactsByUser,
	getSingleContact,
	updateContact,
	deleteContact,
};
