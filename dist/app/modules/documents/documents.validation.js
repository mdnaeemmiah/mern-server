"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentUpdateValidationSchema = exports.DocumentCreateValidationSchema = void 0;
const zod_1 = require("zod");
exports.DocumentCreateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(1),
    }),
});
exports.DocumentUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(1).optional(),
    }),
});
