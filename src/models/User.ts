import { Schema } from "mongoose";
import { db } from "@models/db";

let UserSchema = new Schema({
  id: String,
  password: String,
  name: String,
  gender: String,
  age: Number,
  favorite_topics: [{ topic_id: Schema.Types.ObjectId }],
});

export interface UserModel extends Document {
  _id: string;
  id: string;
  password: string;
  name: string;
  gender: string;
  age: string;
  favorite_topics: { topic_id: string }[];
}

export let User = db.model("user", UserSchema);
