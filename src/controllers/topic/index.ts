import { jsonResponse, errorList } from "../../types/response";
import TopicService from "@services/topic";
import UserService from "@services/user";
import { KSTDate } from "@lib/common";

export default class TopicApi {
  static async getRandomTopic(userId: string, res: jsonResponse) {
    try {
      let topics = await TopicService.getNonReadTopic();

      topics = topics.filter(
        (topic: any) =>
          !topic.agrees.includes(userId) &&
          !topic.disagrees.includes(userId) &&
          !topic.rejects.includes(userId)
      );

      const random: number = Math.floor(Math.random() * topics.length);

      return res.json({ code: 0, result: { topic: topics[random] } });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async searchKey(key: string, isFinished: string, res: jsonResponse) {
    const topics = await TopicService.searchKeyword(key, isFinished);

    if (topics.length === 0) {
      return res.json({ code: 0, result: [] });
    }

    return res.json({
      code: 0,
      result: {
        topics:
          isFinished === "true"
            ? topics
                .filter(
                  (topic: any) =>
                    !(
                      topic.rejects.length >= topic.agrees.length &&
                      topic.rejects.length >= topic.disagrees.length
                    )
                )
                .map((topic: any) => {
                  return {
                    ...topic,
                    isAccepted: topic.agrees.length > topic.disagrees.length,
                  };
                })
            : topics.map((topic: any) => {
                const nowDate = KSTDate();
                return {
                  ...topic,
                  remainDays: nowDate.getDate() - topic.finishedAt.getDate(),
                };
              }),
      },
    });
  }

  static async getOnAirTopics(sortBy: "latest" | "hot", res: jsonResponse) {
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
              remainDays: topic.finishedAt.getDate() - nowDate.getDate(),
            };
          }),
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }

  static async getFinishedTopics(res: jsonResponse) {
    try {
      const topics = await TopicService.find(null, true);

      if (topics.length === 0) {
        return res.json({ code: 0, result: [] });
      }

      return res.json({
        code: 0,
        result: {
          topics: topics
            .filter(
              (topic: any) =>
                !(
                  topic.rejects.length >= topic.agrees.length &&
                  topic.rejects.length >= topic.disagrees.length
                )
            )
            .map((topic: any) => {
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

  static async getTopic(topicId: string, userId: string, res: jsonResponse) {
    try {
      if (!topicId) {
        return res.json({ code: -1, result: errorList.LackInformation });
      }

      const topic = await TopicService.findOneById(topicId);

      if (!topic) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      const writeUser = await UserService.findById(topic.wroteBy);
      const isBookmarked = await UserService.checkBookmarkStatus(
        userId,
        topicId
      );

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
            isBookmarked,
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
  ) {
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

  static async changeVoteStatus(
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

      const topic = await TopicService.findOneById(topicId);

      if (!topic) {
        return res.json({ code: -1, result: errorList.NoData });
      }

      const includeType = topic.agrees.includes(memberId)
        ? "agrees"
        : topic.disagrees.includes(memberId)
        ? "disagrees"
        : topic.rejects.includes(memberId)
        ? "rejects"
        : null;

      const voteResult = await TopicService.updateVoteStatus(
        voteType,
        topicId,
        memberId,
        includeType
      );

      if (!voteResult) {
        return res.json({ code: -1, result: errorList.Unable });
      }

      const user = await UserService.findById(topic.wroteBy);

      if (!user) {
        return res.json({ code: -1, result: errorList.Failed });
      }

      return res.json({
        code: 0,
        result: {
          buttonSelected: voteType === includeType ? null : voteType,
        },
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
        return res.json({ code: -1, result: errorList.Failed });
      }

      return res.json({
        code: 0,
        result: {
          isBookMarked: user.favoriteTopics.includes(topicId),
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: -1, result: errorList.Exception });
    }
  }
}
