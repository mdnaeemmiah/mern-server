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
exports.policyService = void 0;
const policy_model_1 = require("./policy.model");
const createPolicy = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sectionNumber = (_a = payload.sectionNumber) !== null && _a !== void 0 ? _a : 1;
    const existingSection = yield policy_model_1.PolicyModel.findOne({
        sectionNumber,
        sectionTitle: { $nin: ["", null] },
    }).select("sectionTitle");
    const result = yield policy_model_1.PolicyModel.create(Object.assign(Object.assign({}, payload), { sectionNumber, sectionTitle: (existingSection === null || existingSection === void 0 ? void 0 : existingSection.sectionTitle) || payload.sectionTitle }));
    yield policy_model_1.PolicyModel.updateMany({
        sectionNumber,
        sectionTitle: { $in: ["", null] },
    }, { $set: { sectionTitle: result.sectionTitle } });
    return result;
});
const getAllPolicies = () => policy_model_1.PolicyModel.find().sort({ sectionNumber: 1, createdAt: 1 });
const getSinglePolicy = (id) => policy_model_1.PolicyModel.findById(id);
const updatePolicy = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield policy_model_1.PolicyModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (result && payload.sectionTitle) {
        yield policy_model_1.PolicyModel.updateMany({ sectionNumber: result.sectionNumber, _id: { $ne: result._id } }, { $set: { sectionTitle: payload.sectionTitle } });
    }
    return result;
});
const deletePolicy = (id) => policy_model_1.PolicyModel.findByIdAndDelete(id);
exports.policyService = {
    createPolicy,
    getAllPolicies,
    getSinglePolicy,
    updatePolicy,
    deletePolicy,
};
