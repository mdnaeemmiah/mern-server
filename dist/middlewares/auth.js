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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const config_1 = __importDefault(require("../app/config"));
const user_model_1 = require("../app/modules/user/user.model");
const sanitizeToken = (rawToken) => {
    if (!rawToken)
        return '';
    return rawToken.trim().replace(/^['\"]+|['\"]+$/g, '');
};
const extractTokenFromRequest = (req) => {
    var _a, _b;
    const authHeader = req.headers.authorization;
    const cookieToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token);
    if (typeof authHeader === 'string' && authHeader.length > 0) {
        const [scheme, credentials] = authHeader.split(' ');
        if ((scheme === null || scheme === void 0 ? void 0 : scheme.toLowerCase()) === 'bearer' && credentials) {
            return sanitizeToken(credentials);
        }
        return sanitizeToken(authHeader);
    }
    if (typeof cookieToken === 'string' && cookieToken.length > 0) {
        return sanitizeToken(cookieToken);
    }
    return '';
};
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = extractTokenFromRequest(req);
        // checking if the token is missing
        if (!token || token === 'null' || token === 'undefined') {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        let decoded;
        try {
            // checking if the given token is valid
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or malformed token');
        }
        const { role, email, iat } = decoded;
        // checking if the user is exist
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
        }
        // Only enforce role checks when roles were provided to the middleware
        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized  hi!");
        }
        req.user = user;
        next();
    }));
};
exports.default = auth;
