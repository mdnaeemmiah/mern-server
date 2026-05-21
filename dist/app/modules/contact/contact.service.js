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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const contact_model_1 = require("./contact.model");
const normalizeContactNumber = (value) => value
    .toString()
    .trim()
    .replace(/[\s\-()]/g, '');
const buildContactSignature = (data) => {
    const normalized = {
        contactName: (data.contactName || '').toString().trim().toLowerCase(),
        contactNumber: normalizeContactNumber((data.contactNumber || '').toString()),
    };
    return crypto_1.default
        .createHash('sha256')
        .update(JSON.stringify(normalized))
        .digest('hex');
};
const createContact = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const dataSignature = buildContactSignature(data);
    const contactData = Object.assign(Object.assign({}, data), { dataSignature });
    const existing = yield contact_model_1.ContactModel.findOne({
        userId: data.userId,
        dataSignature,
    });
    if (existing) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate contact already added');
    }
    try {
        const result = yield contact_model_1.ContactModel.create(contactData);
        return result;
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate contact already added');
        }
        throw error;
    }
});
const getContactsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_model_1.ContactModel.find({ userId }).sort({ createdAt: -1 });
    return result;
});
const getSingleContact = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    const result = yield contact_model_1.ContactModel.findOne({ _id: id, userId });
    return result;
});
const updateContact = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    const existing = yield contact_model_1.ContactModel.findOne({ _id: id, userId });
    if (!existing)
        return null;
    const merged = Object.assign(Object.assign({}, existing.toObject()), payload);
    const dataSignature = buildContactSignature(merged);
    const duplicate = yield contact_model_1.ContactModel.findOne({
        _id: { $ne: id },
        userId,
        dataSignature,
    });
    if (duplicate) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate contact already added');
    }
    try {
        const result = yield contact_model_1.ContactModel.findOneAndUpdate({ _id: id, userId }, Object.assign(Object.assign({}, payload), { dataSignature }), {
            new: true,
            runValidators: true,
        });
        return result;
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate contact already added');
        }
        throw error;
    }
});
const deleteContact = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    const result = yield contact_model_1.ContactModel.findOneAndDelete({ _id: id, userId });
    return result;
});
exports.contactService = {
    createContact,
    getContactsByUser,
    getSingleContact,
    updateContact,
    deleteContact,
};
