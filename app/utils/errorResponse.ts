import { Response } from "express";

const errorResponse = (
  res: Response,
  status: number,
  message: string,
  details: string
) => {
  return res.status(status).json({
    result: "error",
    message,
    details
  });
};

export { errorResponse };
