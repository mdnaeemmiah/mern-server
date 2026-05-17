import { IUser } from '../user/user.interface'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model'
import config from '../../config'
import { TLoginUser } from './auth.interface'
import { StatusCodes } from 'http-status-codes'
import { createToken, verifyToken } from './auth.utils'
import AppError from '../../../errors/AppError';

// import { IUser } from '../user/user.interface';
// import { User } from '../user/user.model';
// import config from '../../config';
// import { TLoginUser } from './auth.interface';
// import { StatusCodes } from 'http-status-codes';
// import { createToken } from './auth.utils';
// import AppError from '../../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import crypto from 'crypto';
import https from 'https';

type TGoogleTokenResponse = {
  access_token: string;
};

type TGoogleUserInfo = {
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

const httpsRequest = <T>(
  url: string,
  options?: https.RequestOptions,
  body?: string,
) => {
  return new Promise<T>((resolve, reject) => {
    const request = https.request(url, options ?? {}, (response) => {
      let rawData = '';

      response.on('data', (chunk) => {
        rawData += chunk;
      });

      response.on('end', () => {
        const statusCode = response.statusCode ?? 500;

        if (statusCode < 200 || statusCode >= 300) {
          return reject(
            new AppError(
              StatusCodes.BAD_REQUEST,
              `Google OAuth request failed with status ${statusCode}`,
            ),
          );
        }

        try {
          const parsed = JSON.parse(rawData);
          resolve(parsed as T);
        } catch {
          reject(
            new AppError(
              StatusCodes.BAD_REQUEST,
              'Invalid response received from Google OAuth',
            ),
          );
        }
      });
    });

    request.on('error', () => {
      reject(
        new AppError(
          StatusCodes.BAD_REQUEST,
          'Failed to connect with Google OAuth services',
        ),
      );
    });

    if (body) {
      request.write(body);
    }

    request.end();
  });
};

const register = async (payload: IUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.email);

  if (user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This user is already exist!');
  }

  // generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  payload.verificationCode = verificationCode;
  payload.verificationCodeExpires = verificationCodeExpires;

  const newUser = new User(payload);
  await newUser.save();

  try {
    await sendEmail(
      newUser.email,
      'Verify your email',
      `<p>Your verification code is: <h1>${verificationCode}</h1></p>`,
    );
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to send verification email',
    );
  }

  return {
    message: 'Please check your email to verify your account.',
  };
};

const verifyEmail = async (email: string, verificationCode: string) => {
  const user = await User.findOne({ email }).select(
    '+verificationCode +verificationCodeExpires',
  );

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (
    !user.verificationCode ||
    user.verificationCode !== verificationCode
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid verification code');
  }

  if (
    !user.verificationCodeExpires ||
    user.verificationCodeExpires < new Date()
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verification code has expired');
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return {
    message: 'Email verified successfully',
  };
};

const login = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.email);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }

  if (!user.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Please verify your email first!');
  }
 
  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked ! !');
  }

  // checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    
    throw new AppError(StatusCodes.FORBIDDEN, 'Password do not matched');
  // create token and sent to the  client

  const jwtPayload = {
    role: user.role,  
    email: user.email,  // Assuming email is unique and used as the user identifier
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(StatusCodes.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);


  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(email);
  // console.log(decoded);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }
 
  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  try {
    await sendEmail(
      user.email,
      'Password Reset',
      `<p>Your password reset code is: <h1>${resetToken}</h1></p>`,
    );
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to send password reset email',
    );
  }

  return {
    message: 'Password reset code sent to your email',
  };
};

const resetPassword = async (payload: {
  email: string;
  code: string;
  newPassword: any;
}) => {
  const { email, code, newPassword } = payload;
  const user = await User.findOne({
    email,
    passwordResetToken: code,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid or expired token');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.needsPasswordChange = false;
  user.passwordChangedAt = new Date();
  await user.save();

  return {
    message: 'Password reset successfully',
  };
};

const codeVerify = async (payload: { email: string; code: string }) => {
  const { email, code } = payload;
  const user = await User.findOne({
    email,
    passwordResetToken: code,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid or expired code');
  }

  return {
    message: 'Code verified successfully',
  };
};

const getGoogleAuthUrl = () => {
  if (
    !config.google_client_id ||
    !config.google_client_secret ||
    !config.google_callback_url
  ) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Google OAuth environment variables are missing',
    );
  }

  const params = new URLSearchParams({
    client_id: config.google_client_id,
    redirect_uri: config.google_callback_url,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const googleCallback = async (code: string) => {
  if (
    !config.google_client_id ||
    !config.google_client_secret ||
    !config.google_callback_url
  ) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Google OAuth environment variables are missing',
    );
  }

  const tokenRequestBody = new URLSearchParams({
    code,
    client_id: config.google_client_id,
    client_secret: config.google_client_secret,
    redirect_uri: config.google_callback_url,
    grant_type: 'authorization_code',
  }).toString();

  const tokenResponse = await httpsRequest<TGoogleTokenResponse>(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(tokenRequestBody),
      },
    },
    tokenRequestBody,
  );

  const googleUser = await httpsRequest<TGoogleUserInfo>(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    },
  );

  if (!googleUser.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Google account email not found in OAuth response',
    );
  }

  let user = await User.findOne({ email: googleUser.email }).select('+password');

  if (!user) {
    const generatedPassword = crypto.randomBytes(32).toString('hex');

    user = await User.create({
      name: googleUser.name || googleUser.email.split('@')[0],
      email: googleUser.email,
      password: generatedPassword,
      isVerified: googleUser.email_verified ?? true,
      needsPasswordChange: false,
      profileImage: googleUser.picture,
      role: 'user',
    });
  }

  if (user.status === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  };
};

export const AuthService = {
  register,
  login,
  changePassword,
  refreshToken,
  verifyEmail,
  forgetPassword,
  resetPassword,
  codeVerify,
  getGoogleAuthUrl,
  googleCallback,
};