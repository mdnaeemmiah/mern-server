export interface ICost {
	userId?: string;
	vehicleId: string;
	amount: number;
	purpose: string;
	entryDate?: Date;
	dataSignature?: string;
	createdAt?: Date;
	updatedAt?: Date;
	[key: string]: any;
}
