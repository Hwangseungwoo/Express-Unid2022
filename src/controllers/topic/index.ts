import { jsonResponse, errorList } from "../../types/response";
import TopicService from "@services/topic";
import UserService from "@services/user";
import { KSTDate } from "@lib/common";

export default class TopicApi {
  static async getRandomTopic(userId: string, res: jsonResponse): Promise<any> {
    try {
      const topic = await TopicService.getNonReadTopic(userId);
      if (!topic) {
        return res.json({ code: 0, result: null });
      }

      return res.json({ code: 0, result: { topic } });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async getOnAirTopics(
    sortBy: "latest" | "hot",
    res: jsonResponse
  ): Promise<any> {
    try {
      if (!["latest", "hot"].includes(sortBy)) {
        return res.json({ code: -1, result: errorList.NotAllowed });
      }

      const topics = await TopicService.find(sortBy, false);

      if (topics.length === 0) {
        return res.json({ code: 0, result: [] });
      }

      return res.json({
        code: 0,
        result: {
          topics: topics.map((topic: any) => {
            const nowDate = KSTDate();
            return {
              ...topic,
              remainDays: nowDate.getDate() - topic.finishedAt.getDate(),
            };
          }),
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async getFinishedTopics(res: jsonResponse): Promise<any> {
    try {
      const topics = await TopicService.find(null, true);

      if (topics.length === 0) {
        return res.json({ code: 0, result: [] });
      }

      return res.json({
        code: 0,
        result: {
          topics: topics.map((topic: any) => {
            return {
              ...topic,
              isAccepted: topic.agrees.length > topic.disagrees.length,
            };
          }),
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async getTopic(
    topicId: string,
    userId: string,
    res: jsonResponse
  ): Promise<any> {
    try {
      if (!topicId) {
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      const topic = await TopicService.findOneById(topicId);

      if (!topic) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      const writeUser = await UserService.findById(topic.wroteBy);
      // const isBookmarked = await UserService.checkBookmarkStatus();

      if (!writeUser) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      const user = await UserService.findById(userId);
      if (userId && !user) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      const buttonSelected =
        userId && user
          ? topic.agrees.includes(userId)
            ? "agree"
            : topic.disagrees.includes(userId)
            ? "disagree"
            : topic.rejects.includes(userId)
            ? "rejects"
            : null
          : null;

      const nowDate = KSTDate();

      return res.json({
        code: 0,
        result: {
          topic: {
            ...topic,
            userName: writeUser.name,
            buttonSelected,
            isFinished: topic.finishedAt <= nowDate,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async postTopic(
    body: {
      title: string;
      content: string;
    },
    memberId: string,
    res: jsonResponse
  ): Promise<any> {
    try {
      const { title, content } = body;
      if (!title || !content) {
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      const topicDoc = await TopicService.insert(title, content, memberId);

      if (!topicDoc) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      return res.json({ code: 0 });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async voteTopic(
    topicId: string,
    voteType: string,
    memberId: string,
    res: jsonResponse
  ) {
    try {
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

      const user = await UserService.findById(voteResult.wroteBy);

      if (!user) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      return res.json({
        code: 0,
        result: { topic: { ...voteResult, userName: user.name } },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async cancelVote(
    topicId: string,
    voteType: string,
    memberId: string,
    res: jsonResponse
  ) {
    try {
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

      const user = await UserService.findById(voteResult.wroteBy);

      if (!user) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      return res.json({
        code: 0,
        result: { ...voteResult, userName: user.name },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async markTopic(topicId: string, memberId: string, res: jsonResponse) {
    try {
      if (!topicId || !memberId) {
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      const topic = await TopicService.findOneById(topicId);

      if (!topic) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      const user = await UserService.insertFavorite(memberId, topic._id);

      if (!user) {
        return res.json({ code: -11, result: errorList.Failed });
      }

      return res.json({
        code: 0,
        result: { user },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }
}
