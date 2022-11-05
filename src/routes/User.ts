import * as express from "express";
import { asyncWrapper } from "@lib/common";
import { jsonResponse } from "../types/response";
import UserApi from "@controllers/user";

const router = express.Router();

// login
router.post(
  "/",
  asyncWrapper(
    async (req: { body: { id: any; password: any } }, res: jsonResponse) =>
      await UserApi.login(req.body.id, req.body.password, res)
  )
);

export default router;
