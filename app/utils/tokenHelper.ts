import * as jwt from "jsonwebtoken";
import { UserTypes as T } from "../modules/users/types/users";

const tokenizeUser = (userData: T.User): string => {
  const { _id, name, lastName, userName, email, phoneNumber } = userData;

  const token = jwt.sign(
    { userId: _id, name, lastName, userName, email, phoneNumber },
    `${process.env["TOKEN_SECRET"]}`
  );
  return token;
};

const verifyToken = (token: string) => {
  // try {
  return jwt.verify(token, `${process.env["TOKEN_SECRET"]}`);
  // } catch (error) {
  //   return error;
  // }

  // return payload;
};

export { tokenizeUser, verifyToken };
