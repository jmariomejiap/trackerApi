import { Request, Response, NextFunction } from "express";
import Expenses from "../../models/expenses";

const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("valdiateUser cookie", req.cookies);
  const id: String = req.cookies.id;

  if (!id) {
    return res
      .status(401)
      .json({ result: "error", message: "unauthorized user", details: "" });
  }

  return next();
};

const findExpenses = async (req: Request, res: Response) => {
  let query = {};

  // const { name, lastName, email, phoneNumber } = req.query;
  // if (name || lastName || email || phoneNumber) {
  //   query = { ...req.query };
  // }

  let expensesFound;

  try {
    expensesFound = await Expenses.find({ userId: req.cookies.id });
    // console.log("expenseFound ", expensesFound);
  } catch (error) {
    return res.status(500).json({
      result: "error",
      message: "internal error",
      details: error.name
    });
  }

  // if (usersFound.length === 0) {
  //   return res
  //     .status(400)
  //     .json({ result: "error", message: "invalid user", details: "" });
  // }

  return res
    .status(200)
    .json({ result: "ok", data: expensesFound, message: "" });
};

const addExpense = async (req: Request, res: Response) => {
  // console.log(req.body);
  return res.status(200).json({ result: "ok", data: req.body, message: "" });
};

export { addExpense, findExpenses, validateUser };
