import { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

const errorHandler: ErrorRequestHandler = (err: AppError, _req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "failed",
    msg: `Error: ${err.message}`,
  });
  next();
};

export default errorHandler;
