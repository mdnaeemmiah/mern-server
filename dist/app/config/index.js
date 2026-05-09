"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.DB_URL,
    bcrypt_salt_rounds: process.env.Bcrypt_Salt_Round,
    NODE_ENV: process.env.NODE_ENV,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    // Email credentials and transport configuration
    email_user: process.env.EMAIL_USER || process.env.SMTP_USER,
    email_pass: process.env.EMAIL_PASS || process.env.SMTP_PASS,
    email_host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
    email_port: process.env.EMAIL_PORT || 587,
    reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
};
