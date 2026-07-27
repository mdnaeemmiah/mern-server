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
exports.reportController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const report_service_1 = require("./report.service");
const getParam = (value) => (Array.isArray(value) ? value[0] : value) || '';
const createReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const uploadedScenePhotos = Array.isArray(files)
        ? files.filter((f) => f === null || f === void 0 ? void 0 : f.filename).map((f) => `/uploads/profile-images/${f.filename}`)
        : [];
    const bodyScenePhotos = Array.isArray(body.scenePhotos)
        ? body.scenePhotos.filter((x) => typeof x === 'string' && x.trim().length > 0)
        : [];
    const reportData = Object.assign(Object.assign({}, body), { userId, scenePhotos: [...bodyScenePhotos, ...uploadedScenePhotos] });
    const newReport = yield report_service_1.reportService.createReport(reportData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Report created successfully!',
        data: {
            report: newReport,
            summary: report_service_1.reportService.buildReportSummary(newReport),
        },
    });
}));
const getMyReports = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const reports = yield report_service_1.reportService.getReportsByUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Reports retrieved successfully',
        data: {
            items: reports.map((report) => ({
                report,
                summary: report_service_1.reportService.buildReportSummary(report),
            })),
            total: reports.length,
        },
    });
}));
const getSingleReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const report = yield report_service_1.reportService.getSingleReport(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report retrieved successfully',
        data: {
            report,
            summary: report_service_1.reportService.buildReportSummary(report),
        },
    });
}));
const updateReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const uploadedScenePhotos = Array.isArray(files)
        ? files.filter((f) => f === null || f === void 0 ? void 0 : f.filename).map((f) => `/uploads/profile-images/${f.filename}`)
        : [];
    const bodyScenePhotos = Array.isArray(payload.scenePhotos)
        ? payload.scenePhotos.filter((x) => typeof x === 'string' && x.trim().length > 0)
        : [];
    if (uploadedScenePhotos.length > 0 || bodyScenePhotos.length > 0) {
        payload.scenePhotos = [...bodyScenePhotos, ...uploadedScenePhotos];
    }
    const updatedReport = yield report_service_1.reportService.updateReport(id, userId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report updated successfully',
        data: {
            report: updatedReport,
            summary: report_service_1.reportService.buildReportSummary(updatedReport),
        },
    });
}));
const deleteReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const deletedReport = yield report_service_1.reportService.deleteReport(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report deleted successfully',
        data: {
            report: deletedReport,
            summary: report_service_1.reportService.buildReportSummary(deletedReport),
        },
    });
}));
const getReportSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const report = yield report_service_1.reportService.getSingleReport(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Report summary retrieved successfully',
        data: {
            report,
            summary: report_service_1.reportService.buildReportSummary(report),
        },
    });
}));
exports.reportController = {
    createReport,
    getMyReports,
    getSingleReport,
    updateReport,
    deleteReport,
    getReportSummary,
};
