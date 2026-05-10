"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const upload_1 = require("../../../middlewares/upload");
const documents_controller_1 = require("./documents.controller");
const documents_validation_1 = require("./documents.validation");
const documentsRoute = express_1.default.Router();
const maybeUploadDocuments = upload_1.documentUpload.array('files', 10);
documentsRoute.post('/create', (0, auth_1.default)(), upload_1.documentUpload.array('files', 10), (0, validateRequest_1.default)(documents_validation_1.DocumentCreateValidationSchema), documents_controller_1.documentsController.createDocument);
documentsRoute.get('/', (0, auth_1.default)(), documents_controller_1.documentsController.getMyDocuments);
documentsRoute.get('/:id', (0, auth_1.default)(), documents_controller_1.documentsController.getSingleDocument);
documentsRoute.patch('/:id', (0, auth_1.default)(), (req, res, next) => {
    var _a;
    const contentType = (_a = req.headers['content-type']) !== null && _a !== void 0 ? _a : '';
    if (typeof contentType === 'string' && contentType.includes('multipart/form-data')) {
        return maybeUploadDocuments(req, res, next);
    }
    next();
}, (0, validateRequest_1.default)(documents_validation_1.DocumentUpdateValidationSchema), documents_controller_1.documentsController.updateDocument);
documentsRoute.delete('/:id', (0, auth_1.default)(), documents_controller_1.documentsController.deleteDocument);
exports.default = documentsRoute;
