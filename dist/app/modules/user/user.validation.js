"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.UserValidationSchema = void 0;
const zod_1 = require("zod");
const user_contant_1 = require("./user.contant");
// Define the Zod schema
exports.UserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(3, { message: 'Name must be at least 3 characters long' })
            .nonempty({ message: 'Name is required' })
            .trim(),
        email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
        password: zod_1.z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' }),
        role: zod_1.z.enum(['admin', 'user']).default('user'),
        isBlocked: zod_1.z.boolean().default(false),
    }),
});
const changeStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...user_contant_1.UserStatus]),
    }),
});
exports.UserValidation = {
    UserValidationSchema: exports.UserValidationSchema,
    changeStatusValidationSchema
};
