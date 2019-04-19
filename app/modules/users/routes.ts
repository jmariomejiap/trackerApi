import { Router, Request, Response } from "express";
import * as Controller from "./controllers";

const router = Router();

router.get("/", Controller.findUsers);

router.post("/", Controller.verifyUserPayload, Controller.createUser);

router.delete("/", Controller.verifyUserPayload, Controller.deleteUser);

export default router;
