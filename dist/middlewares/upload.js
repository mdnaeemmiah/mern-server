"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'profile-images');
fs_1.default.mkdirSync(uploadDir, { recursive: true });
const documentUploadDir = path_1.default.join(process.cwd(), 'uploads', 'documents');
fs_1.default.mkdirSync(documentUploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname || '') || '.png';
        const name = `${crypto_1.default.randomUUID()}${ext}`;
        cb(null, name);
    },
});
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
const documentStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentUploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname || '') || '.bin';
        const name = `${crypto_1.default.randomUUID()}${ext}`;
        cb(null, name);
    },
});
const documentFileFilter = (req, file, cb) => {
    const allowed = file.mimetype.startsWith('image/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!allowed) {
        return cb(new Error('Only image, PDF, and Word files are allowed'));
    }
    cb(null, true);
};
exports.documentUpload = (0, multer_1.default)({
    storage: documentStorage,
    fileFilter: documentFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
