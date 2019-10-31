import * as jwt from "jsonwebtoken";
import { UserTypes as T } from "../modules/users/types/users";

const tokenizeUser = (newUser: T.User): string => {
  const { _id, name, lastName, email, phoneNumber } = newUser;

  const token = jwt.sign(
    { userId: _id, name, lastName, email, phoneNumber },
    `${process.env["TOKEN_SECRET"]}`
  );
  return token;
};

const verifyToken = (token: string) => {
  // let payload;

  // try {
  return jwt.verify(token, `${process.env["TOKEN_SECRET"]}`);
  // } catch (error) {
  //   return error;
  // }

  // return payload;
};

export { tokenizeUser, verifyToken };
