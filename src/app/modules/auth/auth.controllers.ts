import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';
import config from '../../config';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const refreshCookieOptions = {
  secure: config.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: (config.NODE_ENV === 'production' ? 'none' : 'lax') as
    | 'none'
    | 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 365,
};

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully. Please check your email to verify your account.',
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;
  const result = await AuthService.verifyEmail(email, verificationCode);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Email verified successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgetPassword(email);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset link sent to your email',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});

const codeVerify = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.codeVerify(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Code verified successfully',
    data: result,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const googleUrl = AuthService.getGoogleAuthUrl();

  const userAgent = (req.headers['user-agent'] || '').toString().toLowerCase();
  const wantsJson = req.query.mode === 'json' || userAgent.includes('postman');

  if (wantsJson) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Use this URL in a browser to continue Google login',
      data: {
        authUrl: googleUrl,
      },
    });
    return;
  }

  res.redirect(googleUrl);
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: 'Authorization code is missing from Google callback',
      data: null,
    });
    return;
  }

  const result = await AuthService.googleCallback(code);

  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Google login successful',
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needsPasswordChange,
      user: result.user,
    },
  });
});

export const AuthControllers = {
  register,
  verifyEmail,
  login,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  codeVerify,
  googleLogin,
  googleCallback,
};