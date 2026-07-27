"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePolicyValidationSchema = exports.createPolicyValidationSchema = void 0;
const zod_1 = require("zod");
const policyFields = {
    sectionNumber: zod_1.z
        .number()
        .int("Section number must be a whole number")
        .positive("Section number must be greater than zero")
        .optional(),
    sectionTitle: zod_1.z
        .string()
        .trim()
        .min(1, "Section heading cannot be empty")
        .optional(),
    title: zod_1.z.string().trim().min(1, "Title is required"),
    content: zod_1.z.string().trim().min(1, "Content is required"),
};
exports.createPolicyValidationSchema = zod_1.z.object({
    body: zod_1.z.object(policyFields),
});
exports.updatePolicyValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object(policyFields)
        .partial()
        .refine((body) => Object.keys(body).length > 0, {
        message: "At least one field is required",
    }),
});
