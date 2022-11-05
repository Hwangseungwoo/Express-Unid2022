import * as express from "express";
import { asyncWrapper } from "@lib/common";
import { jsonResponse } from "../types/response";
import UserApi from "@controllers/user";
import Authentication from "@middlewares/Auth";

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

// 작성한 토픽 불러오기
router.get(
  "/topics/:isFinished",
  Authentication.check(true),
  asyncWrapper(
    async (req: { params: { isFinished: string } }, res: jsonResponse) =>
      await UserApi.getUserTopics(
        res.locals.memberUniqueId,
        req.params.isFinished,
        res
      )
  )
);

// 참여한 토픽 불러오기
router.get(
  "/voted/:isFinished",
  Authentication.check(true),
  asyncWrapper(
    async (req: { params: { isFinished: string } }, res: jsonResponse) =>
      await UserApi.getUserVoted(
        res.locals.memberUniqueId,
        req.params.isFinished,
        res
      )
  )
);

// 즐려찾기 토픽 불러오기
router.get(
  "/bookmarks/:isFinished",
  Authentication.check(true),
  asyncWrapper(
    async (req: { params: { isFinished: string } }, res: jsonResponse) =>
      await UserApi.getUserBookmarks(
        res.locals.memberUniqueId,
        req.params.isFinished,
        res
      )
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

// 회원가입
router.post(
  "/signup",
  asyncWrapper(
    async (
      req: {
        body: {
          id: string;
          password: string;
          name: string;
          gender: string;
          age: number;
        };
      },
      res: jsonResponse
    ) => await UserApi.signUp(req.body, res)
  )
);

export default router;
