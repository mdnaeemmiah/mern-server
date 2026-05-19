export interface IContact {
	userId?: string;
	contactName: string;
	contactNumber: string;
	dataSignature?: string;
	createdAt?: Date;
	updatedAt?: Date;
	[key: string]: any;
}
