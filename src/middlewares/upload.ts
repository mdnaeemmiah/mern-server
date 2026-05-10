import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.join(process.cwd(), 'uploads', 'profile-images');
fs.mkdirSync(uploadDir, { recursive: true });

const documentUploadDir = path.join(process.cwd(), 'uploads', 'documents');
fs.mkdirSync(documentUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.png';
    const name = `${crypto.randomUUID()}${ext}`;
    cb(null, name);
  },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.bin';
    const name = `${crypto.randomUUID()}${ext}`;
    cb(null, name);
  },
});

const documentFileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowed =
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (!allowed) {
    return cb(new Error('Only image, PDF, and Word files are allowed'));
  }
  cb(null, true);
};

export const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
