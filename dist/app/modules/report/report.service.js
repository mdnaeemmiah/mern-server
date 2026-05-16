"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const report_model_1 = require("./report.model");
const createReport = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_model_1.ReportModel.create(data);
    return result;
});
const getReportsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_model_1.ReportModel.find({ userId }).sort({ createdAt: -1 });
    return result;
});
const getSingleReport = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_model_1.ReportModel.findOne({ _id: id, userId });
    return result;
});
const updateReport = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_model_1.ReportModel.findOneAndUpdate({ _id: id, userId }, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteReport = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_model_1.ReportModel.findOneAndDelete({ _id: id, userId });
    return result;
});
const buildReportSummary = (report) => {
    if (!report)
        return null;
    const thirdParties = Array.isArray(report.thirdParties) ? report.thirdParties : [];
    const witnesses = Array.isArray(report.witnesses) ? report.witnesses : [];
    const scenePhotos = Array.isArray(report.scenePhotos) ? report.scenePhotos : [];
    const nextSteps = [];
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
exports.reportService = {
    createReport,
    getReportsByUser,
    getSingleReport,
    updateReport,
    deleteReport,
    buildReportSummary,
};
