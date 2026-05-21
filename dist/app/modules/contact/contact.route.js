"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const contact_controller_1 = require("./contact.controller");
const contact_validation_1 = require("./contact.validation");
const contactRoute = express_1.default.Router();
contactRoute.post('/create', (0, auth_1.default)(), (0, validateRequest_1.default)(contact_validation_1.ContactCreateValidationSchema), contact_controller_1.contactController.createContact);
contactRoute.get('/', (0, auth_1.default)(), contact_controller_1.contactController.getMyContacts);
contactRoute.get('/:id', (0, auth_1.default)(), contact_controller_1.contactController.getSingleContact);
contactRoute.patch('/:id', (0, auth_1.default)(), (0, validateRequest_1.default)(contact_validation_1.ContactUpdateValidationSchema), contact_controller_1.contactController.updateContact);
contactRoute.delete('/:id', (0, auth_1.default)(), contact_controller_1.contactController.deleteContact);
exports.default = contactRoute;
