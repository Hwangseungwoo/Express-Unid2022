import { Schema } from "mongoose";
import { db } from "@models/db";

let TopicSchema = new Schema({
  title: String,
  content: String,
  wrote_by: Schema.Types.ObjectId,
  wrote_at: Date,
  agrees: [Schema.Types.ObjectId],
  disagrees: [Schema.Types.ObjectId],
  rejects: [Schema.Types.ObjectId],
  finished_at: Date,
});

export interface TopicModel extends Document {
  _id: string;
  title: string;
  content: string;
  wrote_by: string;
  wrote_at: Date;
  agrees: string[];
  disagrees: string[];
  rejects: string[];
  finished_at: Date;
}

export let Topic = db.model("topic", TopicSchema);
