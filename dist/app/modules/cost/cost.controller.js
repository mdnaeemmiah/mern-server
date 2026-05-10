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
exports.costController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const cost_service_1 = require("./cost.service");
const createCost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const costData = Object.assign(Object.assign({}, body), { userId });
    const newCost = yield cost_service_1.costService.createCost(costData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Cost created successfully!',
        data: newCost,
    });
}));
const getMyCosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const costs = yield cost_service_1.costService.getCostsByUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Costs retrieved successfully',
        data: costs,
    });
}));
const getSingleCost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { id } = req.params;
    const cost = yield cost_service_1.costService.getSingleCost(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Cost retrieved successfully',
        data: cost,
    });
}));
const updateCost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { id } = req.params;
    const payload = req.body || {};
    const updatedCost = yield cost_service_1.costService.updateCost(id, userId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Cost updated successfully',
        data: updatedCost,
    });
}));
const deleteCost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { id } = req.params;
    const deletedCost = yield cost_service_1.costService.deleteCost(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Cost deleted successfully',
        data: deletedCost,
    });
}));
const getCostSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const period = (req.query.period || 'daily').toString();
    const summary = yield cost_service_1.costService.getCostSummary(userId, period);
    const yearlySummary = yield cost_service_1.costService.getCostSummary(userId, 'yearly');
    const monthlySummary = yield cost_service_1.costService.getCostSummary(userId, 'monthly');
    const weeklySummary = yield cost_service_1.costService.getCostSummary(userId, 'weekly');
    const dailySummary = yield cost_service_1.costService.getCostSummary(userId, 'daily');
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Cost summary retrieved successfully',
        data: {
            period: summary.period,
            card: {
                totalRunningCosts: summary.totalRunningCosts,
                totalEntries: summary.totalEntries,
                averageDailyCost: summary.averageDailyCost,
                basedOnDays: summary.dayCount,
                averageCostPerEntry: summary.averageCostPerEntry,
            },
            spendingTrend: summary.trend,
            dailySpendingTrend: dailySummary.trend,
            weeklySpendingTrend: weeklySummary.trend,
            monthlySpendingTrend: monthlySummary.trend,
            yearlySpendingTrend: yearlySummary.trend,
        },
    });
}));
exports.costController = {
    createCost,
    getMyCosts,
    getSingleCost,
    updateCost,
    deleteCost,
    getCostSummary,
};
