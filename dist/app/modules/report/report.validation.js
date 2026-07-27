"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportUpdateValidationSchema = exports.ReportCreateValidationSchema = void 0;
const zod_1 = require("zod");
const reportBodySchema = zod_1.z.object({
    accidentDateTime: zod_1.z.coerce.date().optional(),
    location: zod_1.z.string().trim().optional(),
    incidentDetails: zod_1.z.string().trim().optional(),
    weatherConditions: zod_1.z.string().trim().optional(),
    roadConditions: zod_1.z.string().trim().optional(),
    damageDescription: zod_1.z.string().trim().optional(),
    injuries: zod_1.z.coerce.boolean().optional(),
    policeAttended: zod_1.z.coerce.boolean().optional(),
    thirdParties: zod_1.z
        .array(zod_1.z.object({
        fullName: zod_1.z.string().trim().min(1),
        phoneNumber: zod_1.z.string().trim().optional(),
        emailAddress: zod_1.z.string().trim().email().optional(),
        registration: zod_1.z.string().trim().optional(),
        make: zod_1.z.string().trim().optional(),
        model: zod_1.z.string().trim().optional(),
        insuranceCompany: zod_1.z.string().trim().optional(),
        policyNumber: zod_1.z.string().trim().optional(),
    }))
        .optional(),
    witnesses: zod_1.z
        .array(zod_1.z.object({
        fullName: zod_1.z.string().trim().min(1),
        phoneNumber: zod_1.z.string().trim().optional(),
        emailAddress: zod_1.z.string().trim().email().optional(),
        statement: zod_1.z.string().trim().optional(),
    }))
        .optional(),
    scenePhotos: zod_1.z.array(zod_1.z.string().trim().min(1)).optional(),
});
exports.ReportCreateValidationSchema = reportBodySchema;
exports.ReportUpdateValidationSchema = reportBodySchema;
