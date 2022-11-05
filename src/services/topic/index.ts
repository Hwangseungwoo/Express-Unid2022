import { Topic, TopicModel } from "@models/Topic";
import { KSTDate } from "@lib/common";
import { Types } from "mongoose";

export default class TopicService {
  _id: string;
  title: string;
  content: string;
  wroteBy: string;
  wroteAt: Date;
  agrees: string[];
  disagrees: string[];
  rejects: string[];
  finishedAt: Date;

  constructor(doc: TopicModel) {
    this._id = String(doc._id);
    this.title = doc.title;
    this.content = doc.content;
    this.wroteBy = doc.wrote_by;
    this.wroteAt = doc.wrote_at;
    this.agrees = doc.agrees;
    this.disagrees = doc.disagrees;
    this.rejects = doc.rejects;
    this.finishedAt = doc.finished_at;
  }
  static async find(
    sortBy: "hot" | "latest" | null,
    isFinished: boolean
  ): Promise<any> {
    const nowDate = KSTDate();
    if (!isFinished) {
      let topics: TopicModel[] = await Topic.find({
        finished_at: { $gt: nowDate },
      });

      if (sortBy === "hot") {
        topics.sort(
          (a, b) =>
            a.agrees.length +
            a.disagrees.length -
            (b.agrees.length + b.disagrees.length)
        );
      }

      return topics.map((topic) => new TopicService(topic));
    } else {
      let topics: TopicModel[] = await Topic.find({
        finished_at: { $lte: nowDate },
      });

      return topics.map((topic) => new TopicService(topic));
    }
  }

  static async findOneById(topicId: string): Promise<TopicService | null> {
    let topic: TopicModel | null = await Topic.findOne({ _id: topicId });

    return topic ? new TopicService(topic) : null;
  }

  static async insert(
    title: string,
    content: string,
    memberId: string
  ): Promise<any> {
    const nowDate = KSTDate();
    const finishedDate = KSTDate();
    finishedDate.setDate(finishedDate.getDate() + 7);

    const topicDoc: any = await new Topic({
      title,
      content,
      wrote_by: memberId,
      wrote_at: nowDate,
      agrees: [],
      disagrees: [],
      rejects: [],
      finished_at: finishedDate,
    }).save();

    return topicDoc ? new TopicService(topicDoc) : null;
  }

  static async findByUserId(
    userId: string
  ): Promise<any> {
    const topics: TopicModel[] = await Topic.find({
      wrote_by: userId
    });
    
    return topics.map(topic => new TopicService(topic));
  }

  static async voteToTopic(
    voteType: string,
    topicId: string,
    memberId: string
  ): Promise<any> {
    let updateVoteResult: TopicModel | null;
    if (voteType === "agree") {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $push: { agrees: memberId } },
        { new: true }
      );
    } else if (voteType === "disagree") {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $push: { disagrees: memberId } },
        { new: true }
      );
    } else {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $push: { rejects: memberId } },
        { new: true }
      );
    }

    if (!updateVoteResult) {
      return null;
    }

    return new TopicService(updateVoteResult);
  }

  static async findVotedByUserId(
    memberId: string
  ): Promise<any> {
    const voted: TopicModel[] = await Topic.find({
      $or: [
        {agrees: { $elemMatch: { $eq: new Types.ObjectId(memberId) } } },
        {disagrees: { $elemMatch: { $eq: new Types.ObjectId(memberId) } } },
        {rejects: { $elemMatch: { $eq: new Types.ObjectId(memberId) } } },
      ]
    })
    return voted.map(vote => new TopicService(vote));
  }

  static async CancelTopic(
    voteType: string,
    topicId: string,
    memberId: string
  ): Promise<any> {
    let updateVoteResult: TopicModel | null;
    if (voteType === "agree") {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $pull: { agrees: memberId } },
        { new: true }
      );
    } else if (voteType === "disagree") {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $pull: { disagrees: memberId } },
        { new: true }
      );
    } else {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $pull: { rejects: memberId } },
        { new: true }
      );
    }

    if (!updateVoteResult) {
      return null;
    }

    return new TopicService(updateVoteResult);
  }

  static async getNonReadTopic(userId: string): Promise<any> {
    const topic: TopicModel | null = await Topic.findOne({
      $and: [
        {
          $nin: { agrees: userId },
        },
        { $nin: { disagrees: userId } },
        { $nin: { rejects: userId } },
      ],
    });

    return topic ? new TopicService(topic) : null;
  }
}
