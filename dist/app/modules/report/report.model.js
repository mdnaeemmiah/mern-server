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
exports.ReportModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReportSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    accidentDateTime: { type: Date, default: Date.now, index: true },
    location: { type: String, trim: true },
    incidentDetails: { type: String, trim: true },
    weatherConditions: { type: String, trim: true },
    roadConditions: { type: String, trim: true },
    damageDescription: { type: String, trim: true },
    injuries: { type: Boolean, default: false },
    policeAttended: { type: Boolean, default: false },
    thirdParties: {
        type: [
            {
                fullName: { type: String, required: true, trim: true },
                phoneNumber: { type: String, trim: true },
                emailAddress: { type: String, trim: true },
                registration: { type: String, trim: true },
                make: { type: String, trim: true },
                model: { type: String, trim: true },
                insuranceCompany: { type: String, trim: true },
                policyNumber: { type: String, trim: true },
            },
        ],
        default: [],
    },
    witnesses: {
        type: [
            {
                fullName: { type: String, required: true, trim: true },
                phoneNumber: { type: String, trim: true },
                emailAddress: { type: String, trim: true },
                statement: { type: String, trim: true },
            },
        ],
        default: [],
    },
    scenePhotos: { type: [String], default: [] },
}, { timestamps: true });
exports.ReportModel = mongoose_1.default.model('ReportModel', ReportSchema);
