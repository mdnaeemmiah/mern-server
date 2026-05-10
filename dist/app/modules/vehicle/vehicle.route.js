"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicle_controller_1 = require("./vehicle.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const vehicle_validation_1 = require("./vehicle.validation");
const upload_1 = require("../../../middlewares/upload");
const vehicleRoute = express_1.default.Router();
// Create a new vehicle (auth required)
// order: auth -> multer parses multipart/form-data -> validation -> controller
vehicleRoute.post('/create', (0, auth_1.default)(), upload_1.upload.array('galleryImages', 6), (0, validateRequest_1.default)(vehicle_validation_1.VehicleValidationSchema), vehicle_controller_1.vehicleController.createVehicle);
// Get all vehicles for current authenticated user (no userId param needed)
vehicleRoute.get('/my-vehicles', (0, auth_1.default)(), vehicle_controller_1.vehicleController.getMyVehicles);
// Get all vehicles for a specific user
vehicleRoute.get('/user/:userId', vehicle_controller_1.vehicleController.getVehiclesByUser);
// Get a single vehicle by ID
vehicleRoute.get('/:id', vehicle_controller_1.vehicleController.getSingleVehicle);
// Update a vehicle by ID
vehicleRoute.patch('/:id', (0, auth_1.default)(), upload_1.upload.array('galleryImages', 6), (0, validateRequest_1.default)(vehicle_validation_1.VehicleUpdateValidationSchema), vehicle_controller_1.vehicleController.updateVehicle);
// Delete a vehicle by ID
vehicleRoute.delete('/:id', vehicle_controller_1.vehicleController.deleteVehicle);
exports.default = vehicleRoute;
