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
exports.vehicleController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const vehicle_service_1 = require("./vehicle.service");
// Create a new vehicle
const createVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // Ensure we have a body object (multer sets req.body for multipart)
    const body = req.body || {};
    // Remove userId if someone sent it
    if ('userId' in body)
        delete body.userId;
    // Get authenticated user id from req.user (set by auth middleware)
    // req.user is full user document, _id is ObjectId, convert to string
    const userId = (((_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString) === null || _c === void 0 ? void 0 : _c.call(_b)) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id));
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'User not authenticated',
            data: null,
        });
    }
    // Handle uploaded files (galleryImages) with hash-based dedupe
    const files = req.files;
    const galleryImages = [];
    const galleryImageHashes = [];
    if (files && Array.isArray(files)) {
        const seen = new Set();
        for (const f of files) {
            if (f && f.filename) {
                const filePath = path_1.default.join(process.cwd(), 'uploads', 'profile-images', f.filename);
                const fileBuffer = fs_1.default.readFileSync(filePath);
                const hash = crypto_1.default.createHash('sha256').update(fileBuffer).digest('hex');
                if (!seen.has(hash)) {
                    seen.add(hash);
                    galleryImages.push(`/uploads/profile-images/${f.filename}`);
                    galleryImageHashes.push(hash);
                }
            }
        }
    }
    const vehicleData = Object.assign(Object.assign(Object.assign(Object.assign({}, body), { userId }), (galleryImages.length > 0 ? { galleryImages } : {})), (galleryImageHashes.length > 0 ? { galleryImageHashes } : {}));
    const newVehicle = yield vehicle_service_1.vehicleService.createVehicle(vehicleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Vehicle created successfully!',
        data: newVehicle,
    });
}));
// Get all vehicles for a specific user (by userId param)
const getVehiclesByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const vehicles = yield vehicle_service_1.vehicleService.getVehiclesByUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vehicles retrieved successfully',
        data: vehicles,
    });
}));
// Get all vehicles for current authenticated user (from token)
const getMyVehicles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const vehicles = yield vehicle_service_1.vehicleService.getVehiclesByUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Your vehicles retrieved successfully',
        data: vehicles,
    });
}));
// Get single vehicle by ID
const getSingleVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vehicle = yield vehicle_service_1.vehicleService.getSingleVehicle(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vehicle retrieved successfully',
        data: vehicle,
    });
}));
// Update vehicle
const updateVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body || {};
    // Handle uploaded files (galleryImages) with hash-based dedupe
    const files = req.files;
    const galleryImages = [];
    const galleryImageHashes = [];
    if (files && Array.isArray(files)) {
        const seen = new Set();
        for (const f of files) {
            if (f && f.filename) {
                const filePath = path_1.default.join(process.cwd(), 'uploads', 'profile-images', f.filename);
                const fileBuffer = fs_1.default.readFileSync(filePath);
                const hash = crypto_1.default.createHash('sha256').update(fileBuffer).digest('hex');
                if (!seen.has(hash)) {
                    seen.add(hash);
                    galleryImages.push(`/uploads/profile-images/${f.filename}`);
                    galleryImageHashes.push(hash);
                }
            }
        }
    }
    if (galleryImages.length > 0) {
        payload.galleryImageEntriesToAdd = galleryImages.map((img, idx) => ({
            path: img,
            hash: galleryImageHashes[idx],
        }));
    }
    const updatedVehicle = yield vehicle_service_1.vehicleService.updateVehicle(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vehicle updated successfully',
        data: updatedVehicle,
    });
}));
// Delete vehicle
const deleteVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedVehicle = yield vehicle_service_1.vehicleService.deleteVehicle(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vehicle deleted successfully',
        data: deletedVehicle,
    });
}));
exports.vehicleController = {
    createVehicle,
    getVehiclesByUser,
    getMyVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
