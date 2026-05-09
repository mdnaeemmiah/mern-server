


import { IUser } from '../user/user.interface'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model'
import config from '../../config'
import { TLoginUser } from './auth.interface'
import { StatusCodes } from 'http-status-codes'
import { createToken, verifyToken } from './auth.utils'
import AppError from '../../../errors/AppError';

import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../config';
import { TLoginUser } from './auth.interface';
import { StatusCodes } from 'http-status-codes';
import { createToken } from './auth.utils';
import AppError from '../../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import crypto from 'crypto';

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
 
  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked ! !');
  }

  // checking if the password is correct

  // if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    
  //   throw new AppError(StatusCodes.FORBIDDEN, 'Password do not matched');
  //   console.log(payload?.password);
  //   console.log(user?.password)
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

export const AuthService = {
  register,
  login,
  changePassword,
  refreshToken,
  verifyEmail
}