import { Router, Request, Response } from "express";
import * as Controller from "./controllers";
import tokenValidation from "../../middleware/auth";

const router = Router();

router.get("/", tokenValidation, Controller.findExpenses);

router.post(
  "/",
  tokenValidation,
  Controller.validatePayload,
  Controller.addExpense
);

router.delete("/", tokenValidation, Controller.removeExpense);

export default router;
