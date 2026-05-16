import { z } from 'zod';

export const VehicleValidationSchema = z.object({
	body: z.object({
		type: z.string().trim().pipe(z.enum(['car', 'van', 'bike', 'hgv'])),
		registration: z.string().trim().optional(),
		make: z.string().trim().optional(),
		model: z.string().trim().optional(),
		year: z.coerce.number().int().optional(),
		motExpiry: z.string().trim().optional(),
		roadTaxExpiry: z.string().trim().optional(),
		insuranceExpiry: z.string().trim().optional(),
		serviceDue: z.string().trim().optional(),
		breakdownCoverExpiry: z.string().trim().optional(),
		vin: z.string().trim().optional(),
		v5cDocumentNumber: z.string().trim().optional(),
		fuelType: z.string().trim().optional(),
		bodyType: z.string().trim().optional(),
		engineSize: z.string().trim().optional(),
		engineCode: z.string().trim().optional(),
		galleryImages: z.array(z.string()).optional(),
	}),
});

export const VehicleUpdateValidationSchema = z.object({
	body: z.object({
		type: z.string().trim().pipe(z.enum(['car', 'van', 'bike', 'hgv'])).optional(),
		registration: z.string().trim().optional(),
		make: z.string().trim().optional(),
		model: z.string().trim().optional(),
		year: z.coerce.number().int().optional(),
		motExpiry: z.string().trim().optional(),
		roadTaxExpiry: z.string().trim().optional(),
		insuranceExpiry: z.string().trim().optional(),
		serviceDue: z.string().trim().optional(),
		breakdownCoverExpiry: z.string().trim().optional(),
		vin: z.string().trim().optional(),
		v5cDocumentNumber: z.string().trim().optional(),
		fuelType: z.string().trim().optional(),
		bodyType: z.string().trim().optional(),
		engineSize: z.string().trim().optional(),
		engineCode: z.string().trim().optional(),
		galleryImages: z.array(z.string()).optional(),
	}),
});
