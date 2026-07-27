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
exports.termsService = void 0;
const terms_model_1 = require("./terms.model");
const createTerms = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sectionNumber = (_a = payload.sectionNumber) !== null && _a !== void 0 ? _a : 1;
    const existingSection = yield terms_model_1.TermsModel.findOne({
        sectionNumber,
        sectionTitle: { $nin: ["", null] },
    }).select("sectionTitle");
    const result = yield terms_model_1.TermsModel.create(Object.assign(Object.assign({}, payload), { sectionNumber, sectionTitle: (existingSection === null || existingSection === void 0 ? void 0 : existingSection.sectionTitle) || payload.sectionTitle }));
    yield terms_model_1.TermsModel.updateMany({
        sectionNumber,
        sectionTitle: { $in: ["", null] },
    }, { $set: { sectionTitle: result.sectionTitle } });
    return result;
});
const getAllTerms = () => terms_model_1.TermsModel.find().sort({ sectionNumber: 1, createdAt: 1 });
const getSingleTerms = (id) => terms_model_1.TermsModel.findById(id);
const updateTerms = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_model_1.TermsModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (result && payload.sectionTitle) {
        yield terms_model_1.TermsModel.updateMany({ sectionNumber: result.sectionNumber, _id: { $ne: result._id } }, { $set: { sectionTitle: payload.sectionTitle } });
    }
    return result;
});
const deleteTerms = (id) => terms_model_1.TermsModel.findByIdAndDelete(id);
exports.termsService = {
    createTerms,
    getAllTerms,
    getSingleTerms,
    updateTerms,
    deleteTerms,
};
