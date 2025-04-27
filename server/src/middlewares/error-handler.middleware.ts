import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@utils/app-error';
import { HTTPSTATUS } from '@config/http.config';
import { formatZodError, getErrorMessage } from '@utils/index';

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next
): any => {
  console.log(`❌ Error occured on PATH: ${req.path}`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: 'Invalid JSON format, Please check your request body.',
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
    error: getErrorMessage(error) || 'Something went wrong, Please try again!',
  });
};
