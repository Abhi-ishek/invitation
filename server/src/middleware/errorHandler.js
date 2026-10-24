import { ApiError } from '../utils/apiError.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Resource not found on endpoint: ${req.originalUrl}`));
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
