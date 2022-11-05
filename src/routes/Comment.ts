import * as express from "express";
import { asyncWrapper } from "@lib/common";
import { jsonResponse } from "../types/response";
import CommentApi from "@controllers/comment";
import Authentication from "@middlewares/Auth";

const router = express.Router();

//댓글 불러오기
router.get(
  "/:topicId",
  Authentication.check(true),
  asyncWrapper(
    async (req: { params: { topicId: string } }, res: jsonResponse) =>
      await CommentApi.getComments(
        req.params.topicId,
        res.locals.memberUniqueId,
        res
      )
  )
);

// 댓글달기
router.post(
  "/",
  Authentication.check(true),
  asyncWrapper(
    async (
      req: { body: { content: string; topicId: string } },
      res: jsonResponse
    ) =>
      await CommentApi.insertComment(
        req.body.content,
        req.body.topicId,
        res.locals.memberUniqueId,
        res
      )
  )
);

// 댓글수정
router.put(
  "/",
  Authentication.check(true),
  asyncWrapper(
    async (
      req: { body: { content: string; commentId: string; topicId: string } },
      res: jsonResponse
    ) =>
      await CommentApi.modifyComment(req.body, res.locals.memberUniqueId, res)
  )
);

// 댓글삭제
router.delete(
  "/:topicId",
  Authentication.check(true),
  asyncWrapper(
    async (req: { params: { topicId: string } }, res: jsonResponse) =>
      await CommentApi.deleteComment(
        req.params.topicId,
        res.locals.memberUniqueId,
        res
      )
  )
);
