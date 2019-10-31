import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserTypes as T } from "./types/users";
import { tokenizeUser, verifyToken } from "../../utils/tokenHelper";
import Users from "../../models/users";

const verifyUserPayload = (req: Request, res: Response, next: NextFunction) => {
  const { name, lastName, email, phoneNumber } = req.body;
  if (!name || !lastName || !email || !phoneNumber) {
    return res.status(400).json({
      result: "error",
      message: "incomplete user information",
      details: ""
    });
  }
  return next();
};

const tokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token;

  if (!token) {
    return res.status(400).json({
      result: "error",
      message: "incomplete user information",
      details: ""
    });
  }

  try {
    const userData = verifyToken(token);

    req.body.data = userData;
  } catch (error) {
    return res.status(500).json({
      result: "error",
      message: "internal error",
      details: error.name
    });
  }
  return next();
};

const findUser = async (req: Request, res: Response) => {
  const { userId, name, lastName, email, phoneNumber } = req.body.data;
  if (!userId) {
    return res.status(400).json({
      result: "error",
      message: "incomplete user information",
      details: ""
    });
  }

  let userFound: T.User | null;

  try {
    userFound = await Users.findById(userId);
  } catch (error) {
    return res.status(500).json({
      result: "error",
      message: "internal error",
      details: error.name
    });
  }

  if (!userFound) {
    return res
      .status(400)
      .json({ result: "error", message: "invalid user", details: "" });
  }

  return res.status(200).json({ result: "ok", data: userFound, details: "" });
};

const createUser = async (req: Request, res: Response) => {
  const newUser: T.User = req.body;

  try {
    const userSaved = await Users.create(newUser);

    const token = tokenizeUser(userSaved);

    return res.status(201).json({ result: "ok", data: token });
  } catch (error) {
    return res.status(500).json({
      result: "error",
      message: "internal error",
      details: error.name
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  // TODO: move this data verification to a middleware
  const { userId, name, lastName, email, phoneNumber } = req.body.data;
  if (!userId || !name || !lastName || !email || !phoneNumber) {
    return res.status(400).json({
      result: "error",
      message: "incomplete user information",
      details: ""
    });
  }

  let deleteResponse: T.DeleteResponse | null;
  try {
    deleteResponse = await Users.deleteOne({ _id: userId });
  } catch (error) {
    return res.status(500).json({
      result: "error",
      message: "internal error",
      details: error.name
    });
  }

  if (deleteResponse.deletedCount === 0) {
    return res
      .status(400)
      .json({ result: "error", userId: "", details: "user doesn't exist" });
  }

  return res
    .status(201)
    .json({ result: "ok", userId: "", details: "user deleted" });
};

export { verifyUserPayload, createUser, tokenValidation, deleteUser, findUser };
