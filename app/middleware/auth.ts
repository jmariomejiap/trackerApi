import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/errorResponse";
import { verifyToken } from "../utils/tokenHelper";

const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
  let token: any =
    req.headers["binnacle-token"] || req.headers["authorization"];

  if (!token) {
    return errorResponse(res, 400, "incomplete user information NO token", "");
  }

  try {
    const userData = verifyToken(token);
    res.locals.userData = userData;
  } catch (error) {
    return errorResponse(res, 400, "incomplete user information Verifying", "");
  }

  return next();
};

export default tokenValidation;
