import { IReport } from './report.interface';
import { ReportModel } from './report.model';

const createReport = async (data: IReport) => {
	const result = await ReportModel.create(data);
	return result;
};

const getReportsByUser = async (userId: string) => {
	const result = await ReportModel.find({ userId }).sort({ createdAt: -1 });
	return result;
};

const getSingleReport = async (id: string, userId: string) => {
	const result = await ReportModel.findOne({ _id: id, userId });
	return result;
};

const updateReport = async (id: string, userId: string, payload: Partial<IReport>) => {
	const result = await ReportModel.findOneAndUpdate({ _id: id, userId }, payload, {
		new: true,
		runValidators: true,
	});
	return result;
};

const deleteReport = async (id: string, userId: string) => {
	const result = await ReportModel.findOneAndDelete({ _id: id, userId });
	return result;
};

const buildReportSummary = (report: IReport | null) => {
	if (!report) return null;

	const thirdParties = Array.isArray(report.thirdParties) ? report.thirdParties : [];
	const witnesses = Array.isArray(report.witnesses) ? report.witnesses : [];
	const scenePhotos = Array.isArray(report.scenePhotos) ? report.scenePhotos : [];

	const nextSteps: string[] = [];
	if (report.injuries) {
		nextSteps.push('Seek medical evaluation and keep all treatment documents.');
	}
	if (report.policeAttended) {
		nextSteps.push('Collect and keep the police report reference for claim processing.');
	}
	if (thirdParties.length > 0) {
		nextSteps.push('Contact your insurer and share third-party details and scene evidence.');
	}
	if (nextSteps.length === 0) {
		nextSteps.push('Keep this report for your records and add any missing details if needed.');
	}

	const reportDateTime = report.accidentDateTime
		? new Date(report.accidentDateTime).toLocaleString('en-GB')
		: 'Not specified';

	return {
		accidentDetails: {
			dateTime: reportDateTime,
			location: report.location || 'Not specified',
			description: report.incidentDetails || 'Not specified',
			weatherConditions: report.weatherConditions || 'Not specified',
			roadConditions: report.roadConditions || 'Not specified',
			damageDescription: report.damageDescription || 'Not specified',
			injuries: Boolean(report.injuries),
			policeAttended: Boolean(report.policeAttended),
		},
		counts: {
			thirdParties: thirdParties.length,
			witnesses: witnesses.length,
			scenePhotos: scenePhotos.length,
		},
		nextSteps,
	};
};

export const reportService = {
	createReport,
	getReportsByUser,
	getSingleReport,
	updateReport,
	deleteReport,
	buildReportSummary,
};

