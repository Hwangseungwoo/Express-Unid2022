import { Schema } from "mongoose";
import { db } from "@models/db";

let UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  id: String,
  password: String,
  name: String,
  gender: String,
  age: Number,
});

export interface UserModel extends Document {
  _id: string;
  id: string;
  password: string;
  name: string;
  gender: string;
  age: string;
}

export let User = db.model("user", UserSchema);
