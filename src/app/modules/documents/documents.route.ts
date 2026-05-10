import express from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { documentUpload } from '../../../middlewares/upload';
import { documentsController } from './documents.controller';
import {
	DocumentCreateValidationSchema,
	DocumentUpdateValidationSchema,
} from './documents.validation';

const documentsRoute = express.Router();

const maybeUploadDocuments = documentUpload.array('files', 10);

documentsRoute.post(
	'/create',
	auth(),
	documentUpload.array('files', 10),
	validateRequest(DocumentCreateValidationSchema),
	documentsController.createDocument,
);

documentsRoute.get('/', auth(), documentsController.getMyDocuments);

documentsRoute.get('/:id', auth(), documentsController.getSingleDocument);

documentsRoute.patch(
	'/:id',
	auth(),
	(req, res, next) => {
		const contentType = req.headers['content-type'] ?? '';
		if (typeof contentType === 'string' && contentType.includes('multipart/form-data')) {
			return maybeUploadDocuments(req, res, next);
		}
		next();
	},
	validateRequest(DocumentUpdateValidationSchema),
	documentsController.updateDocument,
);

documentsRoute.delete('/:id', auth(), documentsController.deleteDocument);

export default documentsRoute;
