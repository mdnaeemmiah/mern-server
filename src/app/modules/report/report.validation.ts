import { z } from 'zod';

const reportBodySchema = z.object({
	accidentDateTime: z.coerce.date().optional(),
	location: z.string().trim().optional(),
	incidentDetails: z.string().trim().optional(),
	weatherConditions: z.string().trim().optional(),
	roadConditions: z.string().trim().optional(),
	damageDescription: z.string().trim().optional(),
	injuries: z.coerce.boolean().optional(),
	policeAttended: z.coerce.boolean().optional(),
	thirdParties: z
		.array(
			z.object({
				fullName: z.string().trim().min(1),
				phoneNumber: z.string().trim().optional(),
				emailAddress: z.string().trim().email().optional(),
				registration: z.string().trim().optional(),
				make: z.string().trim().optional(),
				model: z.string().trim().optional(),
				insuranceCompany: z.string().trim().optional(),
				policyNumber: z.string().trim().optional(),
			}),
		)
		.optional(),
	witnesses: z
		.array(
			z.object({
				fullName: z.string().trim().min(1),
				phoneNumber: z.string().trim().optional(),
				emailAddress: z.string().trim().email().optional(),
				statement: z.string().trim().optional(),
			}),
		)
		.optional(),
	scenePhotos: z.array(z.string().trim().min(1)).optional(),
});

export const ReportCreateValidationSchema = z.object({
	body: reportBodySchema,
});

export const ReportUpdateValidationSchema = z.object({
	body: reportBodySchema,
});

