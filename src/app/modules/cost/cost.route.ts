import express from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { costController } from './cost.controller';
import {
	CostCreateValidationSchema,
	CostUpdateValidationSchema,
} from './cost.validation';

const costRoute = express.Router();

costRoute.post(
	'/create',
	auth(),
	validateRequest(CostCreateValidationSchema),
	costController.createCost,
);

costRoute.get('/', auth(), costController.getMyCosts);

costRoute.get('/summary', auth(), costController.getCostSummary);

costRoute.get('/:id', auth(), costController.getSingleCost);

costRoute.patch(
	'/:id',
	auth(),
	validateRequest(CostUpdateValidationSchema),
	costController.updateCost,
);

costRoute.delete('/:id', auth(), costController.deleteCost);

export default costRoute;
