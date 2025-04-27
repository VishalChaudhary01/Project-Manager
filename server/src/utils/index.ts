import { Response } from 'express';
import { ZodError } from 'zod';
import { HTTPSTATUS } from '@config/http.config';
import { ErrorCodeEnum } from '@enums/error-code.enum';

export const formatZodError = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: 'Validation Failed',
    error: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Something went wrong, Please try again!';
};
