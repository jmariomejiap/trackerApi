import { Router, Request, Response } from "express";
import * as Controller from "./controllers";

const router = Router();

router.get("/", Controller.validateUser, Controller.findExpenses);

router.post(
  "/",
  Controller.validateUser,
  Controller.addExpense
  // (req: Request, res: Response) =>
  // res.status(200).json({ result: "ok", message: "expenses is on" })
);

router.delete("/", (req: Request, res: Response) =>
  res.status(200).json({ result: "ok", message: "expenses is on" })
);

export default router;
