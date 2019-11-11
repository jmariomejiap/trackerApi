import { Request, Response, NextFunction } from "express";
import { UserTypes as T } from "./types/users";
import { tokenizeUser } from "../../utils/tokenHelper";
import { errorResponse } from "../../utils/errorResponse";
import Users from "../../models/users";

const verifyUserLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return errorResponse(res, 400, "incomplete user information", "");
  }

  return next();
};

const verifyUserCreatePayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, lastName, userName, password, email, phoneNumber } = req.body;

  if (!name || !lastName || !userName || !password || !email || !phoneNumber) {
    return errorResponse(res, 400, "incomplete user information", "");
  }

  return next();
};

const findUser = async (req: Request, res: Response) => {
  let userFound: T.User | null;

  try {
    userFound = await Users.findOne({ email: req.body.email });
  } catch (error) {
    return errorResponse(res, 500, "incomplete user information", error.name);
  }

  if (!userFound) {
    return errorResponse(res, 400, "invalid user", "");
  }

  let isValidPassword: Boolean;

  try {
    isValidPassword = await userFound.comparePassword(req.body.password);
  } catch (error) {
    return errorResponse(res, 500, "internal error", error.name);
  }

  if (!isValidPassword) {
    return errorResponse(res, 400, "invalid user", "");
  }

  const data: T.UserDataResponse = {
    name: userFound.name,
    lastName: userFound.lastName,
    userName: userFound.userName,
    email: userFound.email,
    phoneNumber: userFound.phoneNumber
  };

  const token = tokenizeUser(userFound);

  return res
    .status(200)
    .append("x-tracker-token", token)
    .json({ result: "ok", data, token });
};

const createUser = async (req: Request, res: Response) => {
  const newUser: T.User = req.body;

  try {
    const userSaved = await Users.create(newUser);

    const data: T.UserDataResponse = {
      name: userSaved.name,
      lastName: userSaved.lastName,
      userName: userSaved.userName,
      email: userSaved.email,
      phoneNumber: userSaved.phoneNumber
    };

    const token = tokenizeUser(userSaved);

    return res
      .status(201)
      .append("x-tracker-token", token)
      .json({ result: "ok", data, token });
  } catch (error) {
    return errorResponse(res, 500, "internal error", error.name);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  let userFound: T.User | null;

  const userData = res.locals.userData;

  if (userData.email !== req.body.email) {
    return errorResponse(res, 400, "invalid user", "");
  }

  try {
    //find user using id found in the decoded token
    userFound = await Users.findById(userData.userId);
  } catch (error) {
    return errorResponse(res, 500, "internal error", "");
  }

  if (!userFound) {
    return errorResponse(res, 400, "invalid user", "");
  }

  try {
    // check if the password send on the request matches the userFound password.
    const isValidPassword: Boolean = await userFound.comparePassword(
      req.body.password
    );
    if (!isValidPassword) {
      return errorResponse(res, 400, "invalid user", "");
    }
  } catch (error) {
    return errorResponse(res, 500, "internal error", error.name);
  }

  let deleteResponse: T.DeleteResponse | null;
  try {
    deleteResponse = await Users.deleteOne({ _id: userFound._id });
  } catch (error) {
    return errorResponse(res, 500, "internal error", error.name);
  }

  if (deleteResponse.deletedCount === 0) {
    return errorResponse(res, 400, "invalid request", "user doesn't exist");
  }

  return res
    .status(201)
    .json({ result: "ok", userId: "", details: "user deleted" });
};

export {
  verifyUserLogin,
  verifyUserCreatePayload,
  createUser,
  deleteUser,
  findUser
};
