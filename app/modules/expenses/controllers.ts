import { Request, Response, NextFunction } from "express";
import Expenses from "../../models/expenses";
import { ExpensesTypes as T } from "./types/expenses";
import { errorResponse } from "../../utils/errorResponse";

const validatePayload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category, amount } = req.body;

  if (!category || !amount) {
    return errorResponse(res, 400, "incomplete information", "");
  }

  return next();
};

const findExpenses = async (req: Request, res: Response) => {
  const userData = res.locals.userData;

  try {
    const expensesFound: Array<T.Expenses> | Array<any> = await Expenses.find({
      userId: userData.userId
    });

    if (expensesFound.length === 0) {
      return res
        .status(204)
        .json({ result: "ok", data: "", message: "no expenses found" });
    }

    const data = expensesFound.map(expense => {
      const { _id, category, amount, dateCreated } = expense;

      return { _id, category, amount, date: dateCreated };
    });

    return res.status(200).json({ result: "ok", data, message: "" });
  } catch (error) {
    return errorResponse(res, 500, "internal error", error.name);
  }
};

const addExpense = async (req: Request, res: Response) => {
  const userData = res.locals.userData;
  const { category, amount } = req.body;

  try {
    const result: T.Expenses | any = await Expenses.create({
      userId: userData.userId,
      category,
      amount
    });

    if (!result) {
      return errorResponse(res, 500, "internal error", "");
    }

    delete result.userId;

    return res.status(200).json({ result: "ok", data: result, message: "" });
  } catch (error) {
    return errorResponse(res, 500, "internal error", error.name);
  }
};

const removeExpense = async (req: Request, res: Response) => {
  const userData = res.locals.userData;
  const { _id } = req.body;

  try {
    const result: T.Expenses | any = await Expenses.deleteOne({
      _id,
      userId: userData.userId
    });

    if (result.deletedCount === 0) {
      return errorResponse(res, 400, "internal error", "expense not found");
    }

    return res
      .status(200)
      .json({ result: "ok", data: "", message: "item deleted" });
  } catch (error) {
    return errorResponse(res, 500, "internal error", error.name);
  }
};

export { validatePayload, addExpense, findExpenses, removeExpense };
