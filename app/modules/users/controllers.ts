import { Request, Response, NextFunction } from "express";
import { UserTypes as T } from "./types/users";
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

const findUsers = async (req: Request, res: Response) => {
  let query = {};

  const { name, lastName, email, phoneNumber } = req.query;
  if (name || lastName || email || phoneNumber) {
    query = { ...req.query };
  }

  let usersFound: Array<T.User>;

  try {
    usersFound = await Users.find(query);
  } catch (error) {
    return res.status(500).json({
      result: "error",
      message: "internal error",
      details: error.name
    });
  }

  if (usersFound.length === 0) {
    return res
      .status(400)
      .json({ result: "error", message: "invalid user", details: "" });
  }

  console.log("users found === ", usersFound);

  const sortUsers = usersFound.sort((a: T.User, b: T.User) => {
    if (a.lastName < b.lastName) {
      return -1;
    }
    if (a.lastName > b.lastName) {
      return 1;
    }
    return 0;
  });

  return res.status(200).json({ result: "ok", users: usersFound, details: "" });
};

const createUser = async (req: Request, res: Response) => {
  const newUser: T.User = req.body;

  try {
    const usersSaved = await Users.create(newUser);
    return res.status(201).json({ result: "ok", userId: usersSaved._id });
  } catch (error) {
    return res.status(500).json({
      result: "error",
      message: "internal error",
      details: error.name
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { name, lastName, email, phoneNumber } = req.body;

  let deleteResponse: T.DeleteResponse;
  try {
    deleteResponse = await Users.deleteOne({
      name,
      lastName,
      email,
      phoneNumber
    });
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

export { createUser, deleteUser, findUsers, verifyUserPayload };
