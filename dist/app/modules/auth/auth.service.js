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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const http_status_codes_1 = require("http-status-codes");
const auth_utils_1 = require("./auth.utils");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
// import { IUser } from '../user/user.interface';
// import { User } from '../user/user.model';
// import config from '../../config';
// import { TLoginUser } from './auth.interface';
// import { StatusCodes } from 'http-status-codes';
// import { createToken } from './auth.utils';
// import AppError from '../../../errors/AppError';
const sendEmail_1 = require("../../utils/sendEmail");
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByCustomId(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This user is already exist!');
    }
    // generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    payload.verificationCode = verificationCode;
    payload.verificationCodeExpires = verificationCodeExpires;
    const newUser = new user_model_1.User(payload);
    yield newUser.save();
    try {
        yield (0, sendEmail_1.sendEmail)(newUser.email, 'Verify your email', `<p>Your verification code is: <h1>${verificationCode}</h1></p>`);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send verification email');
    }
    return {
        message: 'Please check your email to verify your account.',
    };
});
const verifyEmail = (email, verificationCode) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select('+verificationCode +verificationCodeExpires');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (!user.verificationCode ||
        user.verificationCode !== verificationCode) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid verification code');
    }
    if (!user.verificationCodeExpires ||
        user.verificationCodeExpires < new Date()) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Verification code has expired');
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    yield user.save();
    return {
        message: 'Email verified successfully',
    };
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByCustomId(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found !');
    }
    if (!user.isVerified) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Please verify your email first!');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is blocked ! !');
    }
    // checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Password do not matched');
    // create token and sent to the  client
    const jwtPayload = {
        role: user.role,
        email: user.email, // Assuming email is unique and used as the user identifier
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByCustomId(userData.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is blocked ! !');
    }
    //checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Password do not matched');
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email, iat } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByCustomId(email);
    // console.log(decoded);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is blocked ! !');
    }
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized !');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    yield user.save();
    try {
        yield (0, sendEmail_1.sendEmail)(user.email, 'Password Reset', `<p>Your password reset code is: <h1>${resetToken}</h1></p>`);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send password reset email');
    }
    return {
        message: 'Password reset code sent to your email',
    };
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code, newPassword } = payload;
    const user = yield user_model_1.User.findOne({
        email,
        passwordResetToken: code,
        passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid or expired token');
    }
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.needsPasswordChange = false;
    user.passwordChangedAt = new Date();
    yield user.save();
    return {
        message: 'Password reset successfully',
    };
});
const codeVerify = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = payload;
    const user = yield user_model_1.User.findOne({
        email,
        passwordResetToken: code,
        passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid or expired code');
    }
    return {
        message: 'Code verified successfully',
    };
});
exports.AuthService = {
    register,
    login,
    changePassword,
    refreshToken,
    verifyEmail,
    forgetPassword,
    resetPassword,
    codeVerify,
};
