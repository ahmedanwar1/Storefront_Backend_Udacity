import { Request } from "express";
import { UserReturnedType } from "../types/user";

export default interface ExpressRequestWithUserInfo extends Request {
  user?: UserReturnedType;
}
