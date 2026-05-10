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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsService = void 0;
const documents_model_1 = require("./documents.model");
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const buildDocumentSignature = (data) => {
    const normalized = {
        title: (data.title || '').toString().trim().toLowerCase(),
        fileHashes: Array.isArray(data.fileHashes)
            ? [...data.fileHashes].map((x) => x.toString().trim()).sort()
            : [],
    };
    return crypto_1.default
        .createHash('sha256')
        .update(JSON.stringify(normalized))
        .digest('hex');
};
const createDocument = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const dataSignature = buildDocumentSignature(data);
    const documentData = Object.assign(Object.assign({}, data), { dataSignature });
    const existing = yield documents_model_1.DocumentModel.findOne({
        userId: data.userId,
        dataSignature,
    });
    if (existing) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate document already added');
    }
    const result = yield documents_model_1.DocumentModel.create(documentData);
    return result;
});
const getDocumentsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield documents_model_1.DocumentModel.find({ userId });
    return result;
});
const getSingleDocument = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield documents_model_1.DocumentModel.findOne({ _id: id, userId });
    return result;
});
const updateDocument = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = payload, { fileEntriesToAdd } = _a, rest = __rest(_a, ["fileEntriesToAdd"]);
    const updateQuery = { $set: rest };
    if (fileEntriesToAdd && fileEntriesToAdd.length > 0) {
        const document = yield documents_model_1.DocumentModel.findOne({ _id: id, userId }).select('fileHashes');
        const existingHashes = new Set((document === null || document === void 0 ? void 0 : document.fileHashes) || []);
        const filtered = fileEntriesToAdd.filter((entry) => !existingHashes.has(entry.hash));
        if (filtered.length > 0) {
            updateQuery.$addToSet = {
                files: { $each: filtered.map((x) => x.path) },
                fileHashes: { $each: filtered.map((x) => x.hash) },
            };
        }
    }
    const result = yield documents_model_1.DocumentModel.findOneAndUpdate({ _id: id, userId }, updateQuery, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteDocument = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield documents_model_1.DocumentModel.findOneAndDelete({ _id: id, userId });
    return result;
});
exports.documentsService = {
    createDocument,
    getDocumentsByUser,
    getSingleDocument,
    updateDocument,
    deleteDocument,
};
