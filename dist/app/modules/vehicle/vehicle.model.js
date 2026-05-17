"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DUE_SOON_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const parseVehicleDate = (value) => {
    if (!value)
        return null;
    const normalized = value.trim();
    if (!normalized)
        return null;
    const direct = new Date(normalized);
    if (!Number.isNaN(direct.getTime()))
        return direct;
    const slashOrDash = normalized.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (slashOrDash) {
        const [, day, month, year] = slashOrDash;
        const fallback = new Date(Number(year), Number(month) - 1, Number(day));
        if (!Number.isNaN(fallback.getTime()))
            return fallback;
    }
    return null;
};
const startOfDay = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};
const getExpiryMeta = (value) => {
    const parsed = parseVehicleDate(value);
    if (!parsed) {
        return {
            status: 'upcoming',
            daysRemaining: null,
            label: 'Date not set',
            hasDate: false,
        };
    }
    const today = startOfDay(new Date());
    const target = startOfDay(parsed);
    const daysRemaining = Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY);
    if (daysRemaining < 0) {
        const daysAgo = Math.abs(daysRemaining);
        return {
            status: 'expired',
            daysRemaining,
            label: `Expired ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`,
            hasDate: true,
        };
    }
    if (daysRemaining <= DUE_SOON_DAYS) {
        return {
            status: 'due soon',
            daysRemaining,
            label: daysRemaining === 0 ? 'Expires today' : `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
            hasDate: true,
        };
    }
    return {
        status: 'upcoming',
        daysRemaining,
        label: `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
        hasDate: true,
    };
};
const VehicleSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['car', 'van', 'bike', 'hgv'], required: true },
    registration: { type: String },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    dataSignature: { type: String, index: true, select: false },
    motExpiry: { type: String },
    roadTaxExpiry: { type: String },
    insuranceExpiry: { type: String },
    serviceDue: { type: String },
    breakdownCoverExpiry: { type: String },
    vin: { type: String },
    v5cDocumentNumber: { type: String },
    fuelType: { type: String },
    bodyType: { type: String },
    engineSize: { type: String },
    engineCode: { type: String },
    galleryImages: { type: [String], default: [] },
    galleryImageHashes: { type: [String], default: [], select: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
VehicleSchema.virtual('status').get(function () {
    const details = [
        getExpiryMeta(this.motExpiry),
        getExpiryMeta(this.roadTaxExpiry),
        getExpiryMeta(this.insuranceExpiry),
        getExpiryMeta(this.serviceDue),
        getExpiryMeta(this.breakdownCoverExpiry),
    ].filter((item) => item.hasDate);
    if (details.some((item) => item.status === 'expired')) {
        return 'expired';
    }
    if (details.some((item) => item.status === 'due soon')) {
        return 'due soon';
    }
    return 'upcoming';
});
VehicleSchema.virtual('expiryStatus').get(function () {
    return {
        motExpiry: getExpiryMeta(this.motExpiry),
        roadTaxExpiry: getExpiryMeta(this.roadTaxExpiry),
        insuranceExpiry: getExpiryMeta(this.insuranceExpiry),
        serviceDue: getExpiryMeta(this.serviceDue),
        breakdownCoverExpiry: getExpiryMeta(this.breakdownCoverExpiry),
    };
});
VehicleSchema.index({ userId: 1, registration: 1 }, {
    unique: true,
    partialFilterExpression: {
        registration: { $exists: true, $type: 'string', $nin: ['', null] },
    },
});
VehicleSchema.index({ userId: 1, dataSignature: 1 }, { unique: true });
exports.VehicleModel = mongoose_1.default.model('VehicleModel', VehicleSchema);
