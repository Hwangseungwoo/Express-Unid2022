import { Schema } from "mongoose";
import { db } from "@models/db";

let CommentSchema = new Schema({
  topic_id: Schema.Types.ObjectId,
  content: String,
  wrote_by: Schema.Types.ObjectId,
  wrote_at: Date,
  likes: Number,
  dis_likes: Number,
});

export interface CommentModel extends Document {
  _id: string;
  topic_id: string;
  content: string;
  wrote_by: string;
  wrote_at: Date;
  likes: number;
  dis_likes: number;
}

export let Comment = db.model("comment", CommentSchema);
