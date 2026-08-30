import { HttpError } from 'http-errors';

const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }
  res.status(500).json({
    message: error.message,
  });
};

export default errorHandler;
