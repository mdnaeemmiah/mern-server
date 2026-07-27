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
exports.termsController = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const terms_service_1 = require("./terms.service");
const getId = (value) => (Array.isArray(value) ? value[0] : value) || "";
const createTerms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_service_1.termsService.createTerms(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Terms created successfully",
        data: result,
    });
}));
const getAllTerms = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_service_1.termsService.getAllTerms();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Terms retrieved successfully",
        data: result,
    });
}));
const getSingleTerms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_service_1.termsService.getSingleTerms(getId(req.params.id));
    if (!result)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Terms not found");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Terms retrieved successfully",
        data: result,
    });
}));
const updateTerms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_service_1.termsService.updateTerms(getId(req.params.id), req.body);
    if (!result)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Terms not found");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Terms updated successfully",
        data: result,
    });
}));
const deleteTerms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_service_1.termsService.deleteTerms(getId(req.params.id));
    if (!result)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Terms not found");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Terms deleted successfully",
        data: result,
    });
}));
exports.termsController = {
    createTerms,
    getAllTerms,
    getSingleTerms,
    updateTerms,
    deleteTerms,
};
