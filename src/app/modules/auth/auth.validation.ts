import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email must be provided and must be a string',
      })
      .email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const verifyEmailValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    verificationCode: z.string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    newPassword: z.string(),
    code: z.string(),
  }),
});

const codeVerifyValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string(),
  }),
});

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    dateOfBirth: z
      .string()
      .default("")
      .refine(
        (value) => value === "" || !Number.isNaN(Date.parse(value)),
        { message: 'dateOfBirth must be a valid date string or empty' },
      ),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  verifyEmailValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  codeVerifyValidationSchema,
  registerValidationSchema,
};