import express from 'express';
import auth from '../../../middlewares/auth';
import { upload } from '../../../middlewares/upload';
import validateRequest from '../../../middlewares/validateRequest';
import { reportController } from './report.controller';
import {
	ReportCreateValidationSchema,
	ReportUpdateValidationSchema,
} from './report.validation';

const reportRoute = express.Router();

const maybeUploadScenePhotos = upload.array('scenePhotos', 10);

reportRoute.post(
	'/create',
	auth(),
	upload.array('scenePhotos', 10),
	validateRequest(ReportCreateValidationSchema),
	reportController.createReport,
);

reportRoute.get('/', auth(), reportController.getMyReports);

reportRoute.get('/:id', auth(), reportController.getSingleReport);

reportRoute.get('/:id/summary', auth(), reportController.getReportSummary);

reportRoute.patch(
	'/:id',
	auth(),
	(req, res, next) => {
		const contentType = req.headers['content-type'] ?? '';
		if (typeof contentType === 'string' && contentType.includes('multipart/form-data')) {
			return maybeUploadScenePhotos(req, res, next);
		}
		next();
	},
	validateRequest(ReportUpdateValidationSchema),
	reportController.updateReport,
);

reportRoute.delete('/:id', auth(), reportController.deleteReport);

export default reportRoute;

