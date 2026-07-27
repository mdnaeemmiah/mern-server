import { z } from "zod";

const termsFields = {
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

export const createTermsValidationSchema = z.object({
  body: z.object(termsFields),
});

export const updateTermsValidationSchema = z.object({
  body: z
    .object(termsFields)
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required",
    }),
});
