import { z } from 'zod';

export const ContactCreateValidationSchema = z.object({
	body: z.object({
		contactName: z.string().trim().min(1),
		contactNumber: z.string().trim().min(1),
	}),
});

export const ContactUpdateValidationSchema = z.object({
	body: z.object({
		contactName: z.string().trim().min(1).optional(),
		contactNumber: z.string().trim().min(1).optional(),
	}),
});
