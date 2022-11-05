import * as express from "express";
import { asyncWrapper } from "@lib/common";
import { jsonResponse } from "../types/response";
import TopicApi from "@controllers/topic";
import Authentication from "@middlewares/Auth";

const router = express.Router();

// 리스트 불러오기
router.get(
  "/random",
  Authentication.check(false),
  asyncWrapper(
    async (res: jsonResponse) =>
      await TopicApi.getRandomTopic(res.locals.memberUniqueId, res)
  )
);

// 리스트 불러오기
router.get(
  "/all/:sortBy",
  asyncWrapper(
    async (req: { params: { sortBy: "latest" | "hot" } }, res: jsonResponse) =>
      await TopicApi.getOnAirTopics(req.params.sortBy, res)
  )
);

// 리스트 불러오기
router.get(
  "/finished",
  asyncWrapper(
    async (req: any, res: jsonResponse) => await TopicApi.getFinishedTopics(res)
  )
);

//토픽 전부 불러오기
router.get(
  "/search/:key/type/:isFinished",
  asyncWrapper(
    async (
      req: { params: { key: string; isFinished: string } },
      res: jsonResponse
    ) => await TopicApi.searchKey(req.params.key, req.params.isFinished, res)
  )
);

// 특정 토픽 불러오기
router.get(
  "/:topicId",
  Authentication.check(false),
  asyncWrapper(
    async (req: { params: { topicId: string } }, res: jsonResponse) =>
      await TopicApi.getTopic(
        req.params.topicId,
        res.locals.memberUniqueId,
        res
      )
  )
);

// 작성
router.post(
  "/",
  Authentication.check(true),
  asyncWrapper(
    async (
      req: { body: { title: string; content: string } },
      res: jsonResponse
    ) => await TopicApi.postTopic(req.body, res.locals.memberUniqueId, res)
  )
);

// 토픽에 찬성, 반대, 거절 수정
router.put(
  "/likes/:topicId/likes/:likeType",
  Authentication.check(true),
  asyncWrapper(
    async (
      req: { params: { topicId: string; likeType: string } },
      res: jsonResponse
    ) =>
      await TopicApi.changeVoteStatus(
        req.params.topicId,
        req.params.likeType,
        res.locals.memberUniqueId,
        res
      )
  )
);

// 토픽 즐겨찾기
router.put(
  "/favorite/:topicId",
  Authentication.check(true),
  asyncWrapper(
    async (req: { params: { topicId: string } }, res: jsonResponse) =>
      await TopicApi.markTopic(
        req.params.topicId,
        res.locals.memberUniqueId,
        res
      )
  )
);

export default router;
