import { Comment, CommentModel } from "@models/Comment";
import { KSTDate } from "@lib/common";

export default class CommentService {
  _id: string;
  topicId: string;
  content: string;
  wroteBy: string;
  wroteAt: Date;
  editable: boolean;

  constructor(doc: CommentModel) {
    this._id = String(doc._id);
    this.topicId = String(doc.topic_id);
    this.content = doc.content;
    this.wroteBy = String(doc.wrote_by);
    this.wroteAt = doc.wrote_at;
    this.editable = false;
  }
  static async findById(topicId: string): Promise<CommentService[]> {
    let comments: CommentModel[] = await Comment.find({
      topic_id: topicId,
    });

    return comments.map((comment) => new CommentService(comment));
  }

  static async insert(
    content: string,
    topicId: string,
    memberId: string
  ): Promise<any> {
    const nowDate = KSTDate();

    const topicDoc: any = await new Comment({
      topic_id: topicId,
      content,
      wrote_by: memberId,
      wrote_at: nowDate,
      likes: [],
      dis_likes: [],
    }).save();

    return topicDoc ? new CommentService(topicDoc) : null;
  }

  static async modifyComment(
    content: string,
    commentId: string,
    memberId: string
  ): Promise<any> {
    const comment = await Comment.findOne({
      _id: commentId,
      wrote_by: memberId,
    });

    if (!comment) {
      return null;
    }

    const updatedComment: CommentModel | null = await Comment.findOneAndUpdate(
      { _id: commentId },
      { $set: { comment, wrote_by: KSTDate } }
    );

    return updatedComment ? new CommentService(updatedComment) : null;
  }

  static async deleteComment(
    commentId: string,
    memberId: string
  ): Promise<boolean> {
    const comment = await Comment.findOne({
      _id: commentId,
      wrote_by: memberId,
    });

    if (!comment) {
      return false;
    }

    const updatedComment: CommentModel | null = await Comment.findOneAndDelete({
      _id: commentId,
    });

    return !!updatedComment;
  }
}
