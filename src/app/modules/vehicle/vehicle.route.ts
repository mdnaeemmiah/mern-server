
import express from 'express';
import { vehicleController } from './vehicle.controller';
import auth from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validateRequest';
import {
	VehicleValidationSchema,
	VehicleUpdateValidationSchema,
} from './vehicle.validation';
import { upload } from '../../../middlewares/upload';

const vehicleRoute = express.Router();

// Create a new vehicle (auth required)
// order: auth -> multer parses multipart/form-data -> validation -> controller
vehicleRoute.post(
	'/create',
	auth(),
	upload.array('galleryImages', 6),
	validateRequest(VehicleValidationSchema),
	vehicleController.createVehicle,
);

// Get all vehicles for current authenticated user (no userId param needed)
vehicleRoute.get('/my-vehicles', auth(), vehicleController.getMyVehicles);

// Get all vehicles for a specific user
vehicleRoute.get('/user/:userId', vehicleController.getVehiclesByUser);

// Get a single vehicle by ID
vehicleRoute.get('/:id', vehicleController.getSingleVehicle);

// Update a vehicle by ID
vehicleRoute.patch(
	'/:id',
	auth(),
	upload.array('galleryImages', 6),
	validateRequest(VehicleUpdateValidationSchema),
	vehicleController.updateVehicle,
);

// Delete a vehicle by ID
vehicleRoute.delete('/:id', vehicleController.deleteVehicle);

export default vehicleRoute;
