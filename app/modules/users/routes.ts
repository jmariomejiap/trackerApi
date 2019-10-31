import { Router, Request, Response } from "express";
import * as Controller from "./controllers";

const router = Router();

router.get("/", Controller.tokenValidation, Controller.findUser);

router.post("/", Controller.verifyUserPayload, Controller.createUser);

router.delete("/", Controller.tokenValidation, Controller.deleteUser);

export default router;
