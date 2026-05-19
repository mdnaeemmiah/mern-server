import express from 'express';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import { contactController } from './contact.controller';
import {
	ContactCreateValidationSchema,
	ContactUpdateValidationSchema,
} from './contact.validation';

const contactRoute = express.Router();

contactRoute.post(
	'/create',
	auth(),
	validateRequest(ContactCreateValidationSchema),
	contactController.createContact,
);

contactRoute.get('/', auth(), contactController.getMyContacts);

contactRoute.get('/:id', auth(), contactController.getSingleContact);

contactRoute.patch(
	'/:id',
	auth(),
	validateRequest(ContactUpdateValidationSchema),
	contactController.updateContact,
);

contactRoute.delete('/:id', auth(), contactController.deleteContact);

export default contactRoute;
