import { Router } from 'express';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controllers';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../../middlewares/validateRequest';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../user/user.contant';

const authRouter = Router();

authRouter.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.register,
);

authRouter.post(
  '/verify-email',
  validateRequest(AuthValidation.verifyEmailValidationSchema),
  AuthControllers.verifyEmail,
);

authRouter.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

authRouter.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

authRouter.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

authRouter.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

authRouter.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

authRouter.post(
  '/code-verify',
  validateRequest(AuthValidation.codeVerifyValidationSchema),
  AuthControllers.codeVerify,
);

export default authRouter;