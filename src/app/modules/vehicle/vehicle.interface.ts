export type VehicleType = 'car' | 'van' | 'bike' | 'hgv';
export type VehicleStatus = 'upcoming' | 'due soon' | 'expired';

export interface IExpiryMeta {
	status: VehicleStatus;
	daysRemaining: number | null;
	label: string;
	hasDate: boolean;
}

export interface IExpiryStatus {
	motExpiry: IExpiryMeta;
	roadTaxExpiry: IExpiryMeta;
	insuranceExpiry: IExpiryMeta;
	serviceDue: IExpiryMeta;
	breakdownCoverExpiry: IExpiryMeta;
}

export interface IVehicle {
	userId?: string;
	type: VehicleType;
	registration?: string;
	make: string;
	model: string;
	year: number;
	status?: VehicleStatus;
	expiryStatus?: IExpiryStatus;
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
