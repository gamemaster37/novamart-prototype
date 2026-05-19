import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = Number(error.status || 500);
  const message = status >= 500 ? "Unexpected server error" : error.message;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    error: {
      message,
      status
    }
  });
};
