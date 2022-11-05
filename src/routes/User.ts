import * as express from "express";
import { asyncWrapper } from "@lib/common";
import { jsonResponse } from "../types/response";
import UserApi from "@controllers/user";

const router = express.Router();

// login
router.post(
  "/",
  asyncWrapper(
    async (
      req: { body: { id: string; password: string } },
      res: jsonResponse
    ) => await UserApi.login(req.body.id, req.body.password, res)
  )
);

// id 중복체크
router.get(
  "/:id",
  asyncWrapper(
    async (req: { params: { id: string } }, res: jsonResponse) =>
      await UserApi.checkDuplicateId(req.params.id, res)
  )
);

export default router;
