import { Schema } from "mongoose";
import { db } from "@models/db";

let TopicSchema = new Schema({
  title: String,
  content: String,
  wrote_by: Schema.Types.ObjectId,
  wrote_at: Date,
  agrees: [{ member_id: Schema.Types.ObjectId }],
  disagrees: [{ member_id: Schema.Types.ObjectId }],
  rejects: [{ member_id: Schema.Types.ObjectId }],
  to: String,
  uploaded_at: Date,
});

export interface TopicModel extends Document {
  _id: string;
  title: string;
  content: string;
  wrote_by: string;
  wrote_at: Date;
  agrees: { member_id: string }[];
  disagrees: { member_id: string }[];
  rejects: { member_id: string }[];
  to: String;
  uploaded_at: Date;
}

export let Topic = db.model("topic", TopicSchema);
