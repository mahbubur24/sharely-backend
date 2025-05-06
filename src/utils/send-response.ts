import { Response } from "express";

interface SendResponseOptions<T> {
  success?: boolean;
  message?: string;
  data?: T | null;
  errors?: any;
  statusCode?: number;
}

export function sendResponse<T>(
  res: Response,
  {
    success = true,
    message = "",
    data = null,
    errors = null,
    statusCode = 200,
  }: SendResponseOptions<T>
) {
  return res.status(statusCode).json({ success, message, data, errors });
}
