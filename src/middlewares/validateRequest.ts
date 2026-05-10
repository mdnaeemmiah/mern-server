import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';


const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    // If schema validates and returns a parsed `body`, replace req.body with it
    if (parsed && typeof parsed === 'object' && 'body' in parsed) {
      // @ts-ignore
      req.body = parsed.body;
    }

    next();
  });
};

export default validateRequest;