"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleUpdateValidationSchema = exports.VehicleValidationSchema = void 0;
const zod_1 = require("zod");
exports.VehicleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.string().trim().pipe(zod_1.z.enum(['car', 'van', 'bike', 'hgv'])),
        registration: zod_1.z.string().trim(),
        make: zod_1.z.string().trim(),
        model: zod_1.z.string().trim(),
        year: zod_1.z.coerce.number().int(),
        motExpiry: zod_1.z.string().trim().optional(),
        roadTaxExpiry: zod_1.z.string().trim().optional(),
        insuranceExpiry: zod_1.z.string().trim().optional(),
        serviceDue: zod_1.z.string().trim().optional(),
        breakdownCoverExpiry: zod_1.z.string().trim().optional(),
        vin: zod_1.z.string().trim().optional(),
        v5cDocumentNumber: zod_1.z.string().trim().optional(),
        fuelType: zod_1.z.string().trim().optional(),
        bodyType: zod_1.z.string().trim().optional(),
        engineSize: zod_1.z.string().trim().optional(),
        engineCode: zod_1.z.string().trim().optional(),
        galleryImages: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.VehicleUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.string().trim().pipe(zod_1.z.enum(['car', 'van', 'bike', 'hgv'])).optional(),
        registration: zod_1.z.string().trim().optional(),
        make: zod_1.z.string().trim().optional(),
        model: zod_1.z.string().trim().optional(),
        year: zod_1.z.coerce.number().int().optional(),
        motExpiry: zod_1.z.string().trim().optional(),
        roadTaxExpiry: zod_1.z.string().trim().optional(),
        insuranceExpiry: zod_1.z.string().trim().optional(),
        serviceDue: zod_1.z.string().trim().optional(),
        breakdownCoverExpiry: zod_1.z.string().trim().optional(),
        vin: zod_1.z.string().trim().optional(),
        v5cDocumentNumber: zod_1.z.string().trim().optional(),
        fuelType: zod_1.z.string().trim().optional(),
        bodyType: zod_1.z.string().trim().optional(),
        engineSize: zod_1.z.string().trim().optional(),
        engineCode: zod_1.z.string().trim().optional(),
        galleryImages: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
