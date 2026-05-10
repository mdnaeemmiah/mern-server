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
exports.costService = void 0;
const cost_model_1 = require("./cost.model");
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const buildCostSignature = (data) => {
    const entryDate = data.entryDate ? new Date(data.entryDate) : new Date();
    const dateOnly = entryDate.toISOString().slice(0, 10);
    const normalized = {
        amount: Number(data.amount || 0),
        purpose: (data.purpose || '').toString().trim().toLowerCase(),
        entryDate: dateOnly,
    };
    return crypto_1.default
        .createHash('sha256')
        .update(JSON.stringify(normalized))
        .digest('hex');
};
const createCost = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const entryDate = data.entryDate ? new Date(data.entryDate) : new Date();
    const dataSignature = buildCostSignature(Object.assign(Object.assign({}, data), { entryDate }));
    const costData = Object.assign(Object.assign({}, data), { entryDate, dataSignature });
    const existing = yield cost_model_1.CostModel.findOne({
        userId: data.userId,
        dataSignature,
    });
    if (existing) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate cost already added');
    }
    const result = yield cost_model_1.CostModel.create(costData);
    return result;
});
const getCostsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cost_model_1.CostModel.find({ userId }).sort({ entryDate: -1 });
    return result;
});
const getSingleCost = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    const result = yield cost_model_1.CostModel.findOne({ _id: id, userId });
    return result;
});
const updateCost = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cost_model_1.CostModel.findOneAndUpdate({ _id: id, userId }, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCost = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cost_model_1.CostModel.findOneAndDelete({ _id: id, userId });
    return result;
});
const getDateRange = (period) => {
    const now = new Date();
    const end = new Date(now);
    let start = new Date(now);
    if (period === 'weekly') {
        start.setDate(now.getDate() - 6);
    }
    else if (period === 'monthly') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    else if (period === 'yearly') {
        start = new Date(now.getFullYear(), 0, 1);
    }
    else {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};
const getGroupFormat = (period) => {
    if (period === 'weekly')
        return { $isoWeek: '$entryDate' };
    if (period === 'monthly')
        return { $month: '$entryDate' };
    if (period === 'yearly')
        return { $year: '$entryDate' };
    return { $dateToString: { format: '%Y-%m-%d', date: '$entryDate' } };
};
const formatTrendLabel = (period, value) => {
    if (period === 'weekly')
        return `Week ${value}`;
    if (period === 'monthly')
        return `Month ${value}`;
    if (period === 'yearly')
        return `${value}`;
    return `${value}`;
};
const getCostSummary = (userId, period) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { start, end } = getDateRange(period);
    const matchStage = {
        userId,
        entryDate: { $gte: start, $lte: end },
    };
    const totals = yield cost_model_1.CostModel.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalRunningCosts: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
    ]);
    const trendRaw = yield cost_model_1.CostModel.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: getGroupFormat(period),
                total: { $sum: '$amount' },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const totalRunningCosts = ((_a = totals === null || totals === void 0 ? void 0 : totals[0]) === null || _a === void 0 ? void 0 : _a.totalRunningCosts) || 0;
    const totalEntries = ((_b = totals === null || totals === void 0 ? void 0 : totals[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
    const dayCount = period === 'weekly'
        ? 7
        : period === 'monthly'
            ? 30
            : period === 'yearly'
                ? 365
                : 1;
    const averageDailyCost = totalRunningCosts / dayCount;
    const averageCostPerEntry = totalEntries > 0 ? totalRunningCosts / totalEntries : 0;
    const trend = trendRaw.map((item) => ({
        label: formatTrendLabel(period, item._id),
        value: item.total,
    }));
    return {
        period,
        range: { start, end },
        totalRunningCosts,
        totalEntries,
        averageCostPerEntry,
        averageDailyCost,
        dayCount,
        trend,
    };
});
exports.costService = {
    createCost,
    getCostsByUser,
    getSingleCost,
    updateCost,
    deleteCost,
    getCostSummary,
};
