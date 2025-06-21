"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSchema = void 0;
const zod_1 = require("zod");
exports.taskSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title cannot exceed 100 characters")
        .trim(),
    category: zod_1.z.enum([
        'Arts and Craft',
        'Nature',
        'Family',
        'Sport',
        'Friends',
        'Meditation'
    ], {
        errorMap: () => ({ message: "Please select a valid category" })
    }),
    status: zod_1.z.enum([
        'All Task',
        'Ongoing',
        'Pending',
        'Collaborative Task',
        'Done'
    ], {
        errorMap: () => ({ message: "Please select a valid status" })
    }),
    endDate: zod_1.z.coerce.date({
        required_error: "End date is required",
        invalid_type_error: "End date must be a valid date",
    }),
});
