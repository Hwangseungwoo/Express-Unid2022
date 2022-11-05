import { jsonResponse, errorList } from "../../types/response";
import TopicService from "@services/topic";

export default class TopicApi {
  static async getTopics(
    sortBy: "latest" | "hot",
    res: jsonResponse
  ): Promise<any> {
    if (!["latest", "hot"].includes(sortBy)) {
      return res.json({ code: -1, result: errorList.NotAllowed });
    }

    const topics = await TopicService.find(sortBy);

    if (topics.length === 0) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({ code: 0, result: { topics } });
  }

  static async getTopic(topicId: string, res: jsonResponse): Promise<any> {
    if (!topicId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const topic = await TopicService.findOneById(topicId);

    if (!topic) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({ code: 0, result: { topic } });
  }

  static async postTopic(
    body: {
      title: string;
      content: string;
    },
    memberId: string,
    res: jsonResponse
  ): Promise<any> {
    const { title, content } = body;
    if (!title || !content) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const topicDoc = await TopicService.insert(title, content, memberId);

    if (!topicDoc) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({ code: 0 });
  }

  static async voteTopic(
    topicId: string,
    voteType: string,
    memberId: string,
    res: jsonResponse
  ) {
    if (!voteType || !topicId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    if (!["agree", "disagree", "reject"].includes(voteType)) {
      return res.json({ code: -1, result: errorList.NotAllowed });
    }

    const voteResult = await TopicService.voteToTopic(
      voteType,
      topicId,
      memberId
    );
    if (!voteResult) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({ code: 0, result: { topic: voteResult } });
  }

  static async cancelVote(
    topicId: string,
    voteType: string,
    memberId: string,
    res: jsonResponse
  ) {
    if (!voteType || !topicId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    if (!["agree", "disagree", "reject"].includes(voteType)) {
      return res.json({ code: -1, result: errorList.NotAllowed });
    }

    const voteResult = await TopicService.CancelTopic(
      voteType,
      topicId,
      memberId
    );

    if (!voteResult) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({ code: 0, result: { topic: voteResult } });
  }
}
