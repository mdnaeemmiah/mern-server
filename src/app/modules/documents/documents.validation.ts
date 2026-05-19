import { z } from 'zod';

export const DocumentCreateValidationSchema = z.object({
	body: z.object({
		vehicleId: z.string().trim().min(1),
		title: z.string().trim().min(1),
	}),
});

export const DocumentUpdateValidationSchema = z.object({
	body: z.object({
		vehicleId: z.string().trim().min(1).optional(),
		title: z.string().trim().min(1).optional(),
	}),
});
