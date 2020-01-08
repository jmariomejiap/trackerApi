import { Router } from "express";
import * as Controller from "./controllers";
import tokenValidation from "../../middleware/auth";

const router = Router();

router.post("/login", Controller.verifyUserLogin, Controller.findUser);

router.post(
  "/create",
  Controller.verifyUserCreatePayload,
  Controller.createUser
);

router.delete(
  "/remove",
  Controller.verifyUserLogin,
  tokenValidation,
  Controller.deleteUser
);

export default router;
