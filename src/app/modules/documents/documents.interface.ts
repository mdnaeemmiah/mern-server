export interface IDocument {
	userId?: string;
	vehicleId: string;
	title: string;
	files?: string[];
	fileHashes?: string[];
	dataSignature?: string;
	createdAt?: Date;
	updatedAt?: Date;
	[key: string]: any;
}
