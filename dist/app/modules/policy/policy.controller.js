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
exports.policyController = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const policy_service_1 = require("./policy.service");
const getId = (value) => (Array.isArray(value) ? value[0] : value) || "";
const createPolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield policy_service_1.policyService.createPolicy(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Policy created successfully",
        data: result,
    });
}));
const getAllPolicies = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield policy_service_1.policyService.getAllPolicies();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Policies retrieved successfully",
        data: result,
    });
}));
const getSinglePolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield policy_service_1.policyService.getSinglePolicy(getId(req.params.id));
    if (!result)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Policy not found");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Policy retrieved successfully",
        data: result,
    });
}));
const updatePolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield policy_service_1.policyService.updatePolicy(getId(req.params.id), req.body);
    if (!result)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Policy not found");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Policy updated successfully",
        data: result,
    });
}));
const deletePolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield policy_service_1.policyService.deletePolicy(getId(req.params.id));
    if (!result)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Policy not found");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Policy deleted successfully",
        data: result,
    });
}));
exports.policyController = {
    createPolicy,
    getAllPolicies,
    getSinglePolicy,
    updatePolicy,
    deletePolicy,
};
