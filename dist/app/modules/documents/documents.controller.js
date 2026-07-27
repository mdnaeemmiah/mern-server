"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const documents_service_1 = require("./documents.service");
const getParam = (value) => (Array.isArray(value) ? value[0] : value) || '';
const createDocument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const body = req.body || {};
    if ('userId' in body)
        delete body.userId;
    const userId = (((_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id));
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'User not authenticated',
            data: null,
        });
    }
    const files = req.files;
    const documentFiles = [];
    const documentFileHashes = [];
    if (files && Array.isArray(files)) {
        const seen = new Set();
        for (const f of files) {
            if (f && f.filename) {
                const filePath = path_1.default.join(process.cwd(), 'uploads', 'documents', f.filename);
                const fileBuffer = fs_1.default.readFileSync(filePath);
                const hash = crypto_1.default.createHash('sha256').update(fileBuffer).digest('hex');
                if (!seen.has(hash)) {
                    seen.add(hash);
                    documentFiles.push(`/uploads/documents/${f.filename}`);
                    documentFileHashes.push(hash);
                }
            }
        }
    }
    const documentData = Object.assign(Object.assign(Object.assign(Object.assign({}, body), { userId }), (documentFiles.length > 0 ? { files: documentFiles } : {})), (documentFileHashes.length > 0 ? { fileHashes: documentFileHashes } : {}));
    const newDocument = yield documents_service_1.documentsService.createDocument(documentData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Document created successfully!',
        data: newDocument,
    });
}));
const getMyDocuments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const userId = (((_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id));
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'User not authenticated',
            data: null,
        });
    }
    const documents = yield documents_service_1.documentsService.getDocumentsByUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Documents retrieved successfully',
        data: documents,
    });
}));
const getSingleDocument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const userId = (((_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id));
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'User not authenticated',
            data: null,
        });
    }
    const id = getParam(req.params.id);
    const document = yield documents_service_1.documentsService.getSingleDocument(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Document retrieved successfully',
        data: document,
    });
}));
const updateDocument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const userId = (((_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id));
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'User not authenticated',
            data: null,
        });
    }
    const id = getParam(req.params.id);
    const payload = req.body || {};
    const files = req.files;
    const documentFiles = [];
    const documentFileHashes = [];
    if (files && Array.isArray(files)) {
        const seen = new Set();
        for (const f of files) {
            if (f && f.filename) {
                const filePath = path_1.default.join(process.cwd(), 'uploads', 'documents', f.filename);
                const fileBuffer = fs_1.default.readFileSync(filePath);
                const hash = crypto_1.default.createHash('sha256').update(fileBuffer).digest('hex');
                if (!seen.has(hash)) {
                    seen.add(hash);
                    documentFiles.push(`/uploads/documents/${f.filename}`);
                    documentFileHashes.push(hash);
                }
            }
        }
    }
    if (documentFiles.length > 0) {
        payload.fileEntriesToAdd = documentFiles.map((doc, idx) => ({
            path: doc,
            hash: documentFileHashes[idx],
        }));
    }
    const updatedDocument = yield documents_service_1.documentsService.updateDocument(id, userId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Document updated successfully',
        data: updatedDocument,
    });
}));
const deleteDocument = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const userId = (((_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id));
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'User not authenticated',
            data: null,
        });
    }
    const id = getParam(req.params.id);
    const deletedDocument = yield documents_service_1.documentsService.deleteDocument(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Document deleted successfully',
        data: deletedDocument,
    });
}));
exports.documentsController = {
    createDocument,
    getMyDocuments,
    getSingleDocument,
    updateDocument,
    deleteDocument,
};
