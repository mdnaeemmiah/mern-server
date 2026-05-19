import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { contactService } from './contact.service';

const createContact = catchAsync(async (req: Request, res: Response) => {
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

	const contactData = {
		...body,
		userId,
	};

	const newContact = await contactService.createContact(contactData as any);
	sendResponse(res, {
		statusCode: StatusCodes.CREATED,
		success: true,
		message: 'Contact created successfully!',
		data: newContact,
	});
});

const getMyContacts = catchAsync(async (req: Request, res: Response) => {
	const userId = (req.user?._id?.toString?.() || req.user?.userId || req.user?.id) as string;
	if (!userId) {
		return sendResponse(res, {
			statusCode: StatusCodes.UNAUTHORIZED,
			success: false,
			message: 'User not authenticated',
			data: null,
		});
	}

	const contacts = await contactService.getContactsByUser(userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Contacts retrieved successfully',
		data: contacts,
	});
});

const getSingleContact = catchAsync(async (req: Request, res: Response) => {
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
	const contact = await contactService.getSingleContact(id, userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Contact retrieved successfully',
		data: contact,
	});
});

const updateContact = catchAsync(async (req: Request, res: Response) => {
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
	if ('userId' in payload) delete payload.userId;

	const updatedContact = await contactService.updateContact(id, userId, payload);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Contact updated successfully',
		data: updatedContact,
	});
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
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
	const deletedContact = await contactService.deleteContact(id, userId);
	sendResponse(res, {
		statusCode: StatusCodes.OK,
		success: true,
		message: 'Contact deleted successfully',
		data: deletedContact,
	});
});

export const contactController = {
	createContact,
	getMyContacts,
	getSingleContact,
	updateContact,
	deleteContact,
};
