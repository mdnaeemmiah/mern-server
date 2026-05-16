


import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { IUserRole } from '../app/modules/user/user.interface';
import config from '../app/config';
import { User } from '../app/modules/user/user.model';

const sanitizeToken = (rawToken?: string) => {
  if (!rawToken) return '';
  return rawToken.trim().replace(/^['\"]+|['\"]+$/g, '');
};

const extractTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken || req.cookies?.token;

  if (typeof authHeader === 'string' && authHeader.length > 0) {
    const [scheme, credentials] = authHeader.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && credentials) {
      return sanitizeToken(credentials);
    }
    return sanitizeToken(authHeader);
  }

  if (typeof cookieToken === 'string' && cookieToken.length > 0) {
    return sanitizeToken(cookieToken);
  }

  return '';
};

const auth = (...requiredRoles: IUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = extractTokenFromRequest(req);

    // checking if the token is missing
    if (!token || token === 'null' || token === 'undefined') {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    let decoded: JwtPayload;
    try {
      // checking if the given token is valid
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or malformed token');
    }

    const { role, email, iat } = decoded;

    // checking if the user is exist
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    // Only enforce role checks when roles were provided to the middleware
    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized  hi!"
      );
    }

    req.user = user;
    next();
  });
};

export default auth;
