import { z } from 'zod';

export const CostCreateValidationSchema = z.object({
	body: z.object({
		amount: z.coerce.number().positive(),
		purpose: z.string().trim().min(1),
		entryDate: z.coerce.date().optional(),
	}),
});

export const CostUpdateValidationSchema = z.object({
	body: z.object({
		amount: z.coerce.number().positive().optional(),
		purpose: z.string().trim().min(1).optional(),
		entryDate: z.coerce.date().optional(),
	}),
});
