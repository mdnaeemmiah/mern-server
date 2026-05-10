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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleService = void 0;
const vehicle_model_1 = require("./vehicle.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const crypto_1 = __importDefault(require("crypto"));
const buildVehicleSignature = (data) => {
    const normalized = {
        type: (data.type || '').toString().trim().toLowerCase(),
        registration: (data.registration || '').toString().trim().toUpperCase(),
        make: (data.make || '').toString().trim().toLowerCase(),
        model: (data.model || '').toString().trim().toLowerCase(),
        year: Number(data.year || 0),
        motExpiry: (data.motExpiry || '').toString().trim(),
        roadTaxExpiry: (data.roadTaxExpiry || '').toString().trim(),
        insuranceExpiry: (data.insuranceExpiry || '').toString().trim(),
        serviceDue: (data.serviceDue || '').toString().trim(),
        breakdownCoverExpiry: (data.breakdownCoverExpiry || '').toString().trim(),
        vin: (data.vin || '').toString().trim().toUpperCase(),
        v5cDocumentNumber: (data.v5cDocumentNumber || '').toString().trim(),
        fuelType: (data.fuelType || '').toString().trim().toLowerCase(),
        bodyType: (data.bodyType || '').toString().trim().toLowerCase(),
        engineSize: (data.engineSize || '').toString().trim().toLowerCase(),
        engineCode: (data.engineCode || '').toString().trim().toUpperCase(),
        galleryImageHashes: Array.isArray(data.galleryImageHashes)
            ? [...data.galleryImageHashes].map((x) => x.toString().trim()).sort()
            : [],
    };
    return crypto_1.default
        .createHash('sha256')
        .update(JSON.stringify(normalized))
        .digest('hex');
};
// Create a new vehicle
const createVehicle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedRegistration = (data.registration || '').trim().toUpperCase();
    const dataSignature = buildVehicleSignature(Object.assign(Object.assign({}, data), { registration: normalizedRegistration }));
    const vehicleData = Object.assign(Object.assign({}, data), { registration: normalizedRegistration, dataSignature });
    const existing = yield vehicle_model_1.VehicleModel.findOne({
        userId: data.userId,
        dataSignature,
    });
    if (existing) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate vehicle already added');
    }
    try {
        const result = yield vehicle_model_1.VehicleModel.create(vehicleData);
        return result;
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Vehicle with registration ${normalizedRegistration} already added`);
        }
        throw error;
    }
});
// Get all vehicles for a user (handles both new vehicles with userId and legacy ones)
const getVehiclesByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.VehicleModel.find({
        $or: [
            { userId }, // New vehicles with userId field
            { userId: { $exists: false } }, // Legacy vehicles without userId field
        ],
    });
    return result;
});
// Get single vehicle by ID
const getSingleVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.VehicleModel.findById(id);
    return result;
});
// Update vehicle by ID
const updateVehicle = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = payload, { galleryImageEntriesToAdd } = _a, rest = __rest(_a, ["galleryImageEntriesToAdd"]);
    const updateQuery = { $set: rest };
    if (galleryImageEntriesToAdd && galleryImageEntriesToAdd.length > 0) {
        const vehicle = yield vehicle_model_1.VehicleModel.findById(id).select('galleryImageHashes');
        const existingHashes = new Set((vehicle === null || vehicle === void 0 ? void 0 : vehicle.galleryImageHashes) || []);
        const filtered = galleryImageEntriesToAdd.filter((entry) => !existingHashes.has(entry.hash));
        if (filtered.length > 0) {
            updateQuery.$addToSet = {
                galleryImages: { $each: filtered.map((x) => x.path) },
                galleryImageHashes: { $each: filtered.map((x) => x.hash) },
            };
        }
    }
    const result = yield vehicle_model_1.VehicleModel.findByIdAndUpdate(id, updateQuery, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete vehicle by ID
const deleteVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.VehicleModel.findByIdAndDelete(id);
    return result;
});
exports.vehicleService = {
    createVehicle,
    getVehiclesByUser,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
