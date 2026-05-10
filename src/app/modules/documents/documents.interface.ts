export interface IDocument {
	userId?: string;
	title: string;
	files?: string[];
	fileHashes?: string[];
	dataSignature?: string;
	createdAt?: Date;
	updatedAt?: Date;
	[key: string]: any;
}
