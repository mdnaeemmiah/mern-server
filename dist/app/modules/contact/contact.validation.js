"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUpdateValidationSchema = exports.ContactCreateValidationSchema = void 0;
const zod_1 = require("zod");
exports.ContactCreateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        contactName: zod_1.z.string().trim().min(1),
        contactNumber: zod_1.z.string().trim().min(1),
    }),
});
exports.ContactUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        contactName: zod_1.z.string().trim().min(1).optional(),
        contactNumber: zod_1.z.string().trim().min(1).optional(),
    }),
});
