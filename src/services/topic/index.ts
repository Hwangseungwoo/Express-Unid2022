import { Topic, TopicModel } from "@models/Topic";
import { KSTDate } from "@lib/common";

export default class TopicService {
  _id: string;
  title: string;
  content: string;
  wroteBy: string;
  wroteAt: Date;
  agrees: { member_id: string }[];
  disagrees: { member_id: string }[];
  rejects: { member_id: string }[];
  to: String;
  uploadedAt: Date;

  constructor(doc: TopicModel) {
    this._id = String(doc._id);
    this.title = doc.title;
    this.content = doc.content;
    this.wroteBy = doc.wrote_by;
    this.wroteAt = doc.wrote_at;
    this.agrees = doc.agrees;
    this.disagrees = doc.disagrees;
    this.rejects = doc.rejects;
    this.to = doc.to;
    this.uploadedAt = doc.uploaded_at;
  }
  static async find(sortBy: "hot" | "latest"): Promise<any> {
    let topics: TopicModel[] = await Topic.find();

    if (sortBy === "hot") {
      topics.sort(
        (a, b) =>
          a.agrees.length +
          a.disagrees.length -
          (b.agrees.length + b.disagrees.length)
      );
    }

    return topics.map((topic) => new TopicService(topic));
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

    const topicDoc: any = await new Topic({
      title,
      content,
      wrote_by: memberId,
      wrote_at: nowDate,
      agrees: [],
      disagrees: [],
      rejects: [],
      to: "onair",
      uploaded_at: null,
    }).save();

    return topicDoc ? new TopicService(topicDoc) : null;
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
        { $push: { agrees: { memberId } } },
        { new: true }
      );
    } else if (voteType === "disagree") {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $push: { disagrees: { memberId } } },
        { new: true }
      );
    } else {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $push: { rejects: { memberId } } },
        { new: true }
      );
    }

    if (!updateVoteResult) {
      return null;
    }

    return new TopicService(updateVoteResult);
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
        { $pull: { agrees: { memberId } } },
        { new: true }
      );
    } else if (voteType === "disagree") {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $pull: { disagrees: { memberId } } },
        { new: true }
      );
    } else {
      updateVoteResult = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $pull: { rejects: { memberId } } },
        { new: true }
      );
    }

    if (!updateVoteResult) {
      return null;
    }

    return new TopicService(updateVoteResult);
  }
}
