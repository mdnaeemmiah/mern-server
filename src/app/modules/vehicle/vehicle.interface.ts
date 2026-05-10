export type VehicleType = 'car' | 'van' | 'bike' | 'hgv';

export interface IVehicle {
	userId?: string;
	type: VehicleType;
	registration: string;
	make: string;
	model: string;
	year: number;
	dataSignature?: string;
	motExpiry?: string;
	roadTaxExpiry?: string;
	insuranceExpiry?: string;
	serviceDue?: string;
	breakdownCoverExpiry?: string;
	vin?: string;
	v5cDocumentNumber?: string;
	fuelType?: string;
	bodyType?: string;
	engineSize?: string;
	engineCode?: string;
	galleryImages?: string[];
	galleryImageHashes?: string[];
	createdAt?: Date;
	updatedAt?: Date;
	[key: string]: any;
}
