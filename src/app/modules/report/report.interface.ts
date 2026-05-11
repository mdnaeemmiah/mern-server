export interface IReport {
	userId?: string;
	accidentDateTime?: Date;
	location?: string;
	incidentDetails?: string;
	weatherConditions?: string;
	roadConditions?: string;
	damageDescription?: string;
	injuries?: boolean;
	policeAttended?: boolean;
	thirdParties?: {
		fullName: string;
		phoneNumber?: string;
		emailAddress?: string;
		registration?: string;
		make?: string;
		model?: string;
		insuranceCompany?: string;
		policyNumber?: string;
	}[];
	witnesses?: {
		fullName: string;
		phoneNumber?: string;
		emailAddress?: string;
		statement?: string;
	}[];
	scenePhotos?: string[];
	createdAt?: Date;
	updatedAt?: Date;
	[key: string]: any;
}

