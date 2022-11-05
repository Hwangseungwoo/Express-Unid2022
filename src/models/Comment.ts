import { Schema } from "mongoose";
import { db } from "@models/db";

let CommentSchema = new Schema({
  content: String,
  wrote_by: Schema.Types.ObjectId,
  wrote_at: Date,
  likes: Number,
  dis_likes: Number,
});

export interface Topic {
  _id: string;
  content: string;
  wrote_by: string;
  wrote_at: Date;
  likes: number;
  dis_likes: number;
}

export let Comment = db.model("comment", CommentSchema);
