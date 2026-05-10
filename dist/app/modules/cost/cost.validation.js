"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostUpdateValidationSchema = exports.CostCreateValidationSchema = void 0;
const zod_1 = require("zod");
exports.CostCreateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.coerce.number().positive(),
        purpose: zod_1.z.string().trim().min(1),
        entryDate: zod_1.z.coerce.date().optional(),
    }),
});
exports.CostUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.coerce.number().positive().optional(),
        purpose: zod_1.z.string().trim().min(1).optional(),
        entryDate: zod_1.z.coerce.date().optional(),
    }),
});
