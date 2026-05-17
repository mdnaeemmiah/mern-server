import mongoose, { Schema } from 'mongoose';
import { IVehicle } from './vehicle.interface';

const DUE_SOON_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseVehicleDate = (value?: string): Date | null => {
	if (!value) return null;
	const normalized = value.trim();
	if (!normalized) return null;

	const direct = new Date(normalized);
	if (!Number.isNaN(direct.getTime())) return direct;

	const slashOrDash = normalized.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
	if (slashOrDash) {
		const [, day, month, year] = slashOrDash;
		const fallback = new Date(Number(year), Number(month) - 1, Number(day));
		if (!Number.isNaN(fallback.getTime())) return fallback;
	}

	return null;
};

const startOfDay = (date: Date) => {
	const normalized = new Date(date);
	normalized.setHours(0, 0, 0, 0);
	return normalized;
};

const getExpiryMeta = (value?: string) => {
	const parsed = parseVehicleDate(value);
	if (!parsed) {
		return {
			status: 'upcoming' as const,
			daysRemaining: null as number | null,
			label: 'Date not set',
			hasDate: false,
		};
	}

	const today = startOfDay(new Date());
	const target = startOfDay(parsed);
	const daysRemaining = Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY);

	if (daysRemaining < 0) {
		const daysAgo = Math.abs(daysRemaining);
		return {
			status: 'expired' as const,
			daysRemaining,
			label: `Expired ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`,
			hasDate: true,
		};
	}

	if (daysRemaining <= DUE_SOON_DAYS) {
		return {
			status: 'due soon' as const,
			daysRemaining,
			label: daysRemaining === 0 ? 'Expires today' : `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
			hasDate: true,
		};
	}

	return {
		status: 'upcoming' as const,
		daysRemaining,
		label: `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
		hasDate: true,
	};
};

const VehicleSchema = new Schema<IVehicle>({
	userId: { type: String, required: true, index: true },
	type: { type: String, enum: ['car', 'van', 'bike', 'hgv'], required: true },
	registration: { type: String },
	make: { type: String },
	model: { type: String },
	year: { type: Number },
	dataSignature: { type: String, index: true, select: false },
	motExpiry: { type: String },
	roadTaxExpiry: { type: String },
	insuranceExpiry: { type: String },
	serviceDue: { type: String },
	breakdownCoverExpiry: { type: String },
	vin: { type: String },
	v5cDocumentNumber: { type: String },
	fuelType: { type: String },
	bodyType: { type: String },
	engineSize: { type: String },
	engineCode: { type: String },
	color: { type: String },
	galleryImages: { type: [String], default: [] },
	galleryImageHashes: { type: [String], default: [], select: false },
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

VehicleSchema.virtual('status').get(function (this: IVehicle) {
	const details = [
		getExpiryMeta(this.motExpiry),
		getExpiryMeta(this.roadTaxExpiry),
		getExpiryMeta(this.insuranceExpiry),
		getExpiryMeta(this.serviceDue),
		getExpiryMeta(this.breakdownCoverExpiry),
	].filter((item) => item.hasDate);

	if (details.some((item) => item.status === 'expired')) {
		return 'expired';
	}

	if (details.some((item) => item.status === 'due soon')) {
		return 'due soon';
	}

	return 'upcoming';
});

VehicleSchema.virtual('expiryStatus').get(function (this: IVehicle) {
	return {
		motExpiry: getExpiryMeta(this.motExpiry),
		roadTaxExpiry: getExpiryMeta(this.roadTaxExpiry),
		insuranceExpiry: getExpiryMeta(this.insuranceExpiry),
		serviceDue: getExpiryMeta(this.serviceDue),
		breakdownCoverExpiry: getExpiryMeta(this.breakdownCoverExpiry),
	};
});

VehicleSchema.index(
	{ userId: 1, registration: 1 },
	{
		unique: true,
		partialFilterExpression: {
			registration: { $exists: true, $type: 'string', $nin: ['', null] },
		},
	}
);
VehicleSchema.index({ userId: 1, dataSignature: 1 }, { unique: true });

export const VehicleModel = mongoose.model<IVehicle>('VehicleModel', VehicleSchema);
