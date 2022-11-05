import { Schema } from "mongoose";
import { db } from "@models/db";

let TopicSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  content: String,
  wrote_by: Schema.Types.ObjectId,
  wrote_at: Date,
  agrees: Number,
  disagrees: Number,
  rejects: Number,
  to: String,
  uploaded_at: Date,
});

export interface Topic {
  _id: string;
  title: string;
  content: string;
  wrote_by: string;
  wrote_at: Date;
  agrees: number;
  disagrees: number;
  rejects: number;
  to: String;
  uploaded_at: Date;
}

export let Topic = db.model("topic", TopicSchema);
