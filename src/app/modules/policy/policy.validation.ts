import { z } from "zod";

const policyFields = {
  sectionNumber: z
    .number()
    .int("Section number must be a whole number")
    .positive("Section number must be greater than zero")
    .optional(),
  sectionTitle: z
    .string()
    .trim()
    .min(1, "Section heading cannot be empty")
    .optional(),
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
};

export const createPolicyValidationSchema = z.object({
  body: z.object(policyFields),
});

export const updatePolicyValidationSchema = z.object({
  body: z
    .object(policyFields)
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required",
    }),
});
