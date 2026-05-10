"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const cost_controller_1 = require("./cost.controller");
const cost_validation_1 = require("./cost.validation");
const costRoute = express_1.default.Router();
costRoute.post('/create', (0, auth_1.default)(), (0, validateRequest_1.default)(cost_validation_1.CostCreateValidationSchema), cost_controller_1.costController.createCost);
costRoute.get('/', (0, auth_1.default)(), cost_controller_1.costController.getMyCosts);
costRoute.get('/summary', (0, auth_1.default)(), cost_controller_1.costController.getCostSummary);
costRoute.get('/:id', (0, auth_1.default)(), cost_controller_1.costController.getSingleCost);
costRoute.patch('/:id', (0, auth_1.default)(), (0, validateRequest_1.default)(cost_validation_1.CostUpdateValidationSchema), cost_controller_1.costController.updateCost);
costRoute.delete('/:id', (0, auth_1.default)(), cost_controller_1.costController.deleteCost);
exports.default = costRoute;
