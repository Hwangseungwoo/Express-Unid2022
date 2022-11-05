import { jsonResponse, errorList } from "../../types/response";
import CommentService from "@services/comment";

export default class CommentApi {
  static async getComments(
    topicId: string,
    memberId: string,
    res: jsonResponse
  ): Promise<any> {
    if (!topicId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const comments = await CommentService.findById(topicId);

    return res.json({
      code: 0,
      result: {
        comments: comments.map((comment) => {
          comment.editable = comment.wroteBy === memberId;
          return comment;
        }),
      },
    });
  }

  static async insertComment(
    content: string,
    topicId: string,
    memberId: string,
    res: jsonResponse
  ): Promise<any> {
    if (!content || !topicId || !memberId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const comment = await CommentService.insert(content, topicId, memberId);

    if (!comment) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    const comments = await CommentService.findById(topicId);

    if (comments.length === 0) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({
      code: 0,
      result: {
        comments: comments.map((comment) => {
          comment.editable = comment.wroteBy === memberId;
          return comment;
        }),
      },
    });
  }

  static async modifyComment(
    body: { content: string; commentId: string; topicId: string },
    memberId: string,
    res: jsonResponse
  ): Promise<any> {
    const { content, commentId, topicId } = body;
    if (!content || !commentId || !topicId || !memberId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const comment = await CommentService.modifyComment(
      content,
      commentId,
      memberId
    );

    if (!comment) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    const comments = await CommentService.findById(topicId);

    if (comments.length === 0) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({
      code: 0,
      result: {
        comments: comments.map((comment) => {
          comment.editable = comment.wroteBy === memberId;
          return comment;
        }),
      },
    });
  }

  static async deleteComment(
    topicId: string,
    memberId: string,
    res: jsonResponse
  ): Promise<any> {
    if (!topicId || !memberId) {
      return res.json({ code: -1, result: errorList.LackInformation });
    }

    const comment = await CommentService.deleteComment(topicId, memberId);

    if (!comment) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    const comments = await CommentService.findById(topicId);

    if (comments.length === 0) {
      return res.json({ code: -1, result: errorList.Failed });
    }

    return res.json({
      code: 0,
      result: {
        comments: comments.map((comment) => {
          comment.editable = comment.wroteBy === memberId;
          return comment;
        }),
      },
    });
  }
}
