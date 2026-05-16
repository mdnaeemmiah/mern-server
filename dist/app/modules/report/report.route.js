"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const upload_1 = require("../../../middlewares/upload");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const report_controller_1 = require("./report.controller");
const report_validation_1 = require("./report.validation");
const reportRoute = express_1.default.Router();
const maybeUploadScenePhotos = upload_1.upload.array('scenePhotos', 10);
reportRoute.post('/create', (0, auth_1.default)(), upload_1.upload.array('scenePhotos', 10), (0, validateRequest_1.default)(report_validation_1.ReportCreateValidationSchema), report_controller_1.reportController.createReport);
reportRoute.get('/', (0, auth_1.default)(), report_controller_1.reportController.getMyReports);
reportRoute.get('/:id', (0, auth_1.default)(), report_controller_1.reportController.getSingleReport);
reportRoute.get('/:id/summary', (0, auth_1.default)(), report_controller_1.reportController.getReportSummary);
reportRoute.patch('/:id', (0, auth_1.default)(), (req, res, next) => {
    var _a;
    const contentType = (_a = req.headers['content-type']) !== null && _a !== void 0 ? _a : '';
    if (typeof contentType === 'string' && contentType.includes('multipart/form-data')) {
        return maybeUploadScenePhotos(req, res, next);
    }
    next();
}, (0, validateRequest_1.default)(report_validation_1.ReportUpdateValidationSchema), report_controller_1.reportController.updateReport);
reportRoute.delete('/:id', (0, auth_1.default)(), report_controller_1.reportController.deleteReport);
exports.default = reportRoute;
