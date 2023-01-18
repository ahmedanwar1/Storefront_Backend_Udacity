import express from "express";
import jwt from "jsonwebtoken";
import ExpressRequestWithUserInfo from "../interfaces/ExpressRequestWithUserInfo";
import { UserReturnedType } from "../types/user";
import AppError from "../utils/AppError";

const authenticate = async (
  req: ExpressRequestWithUserInfo,
  _res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(" ")[1];

    if (!token) {
      throw new AppError("Access denied!", 401);
    }

    const user = jwt.verify(token, process.env.TOKEN_SECRET as string);

    req.user = user as UserReturnedType;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
