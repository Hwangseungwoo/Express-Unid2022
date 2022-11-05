import * as express from "express";
import User from "@routes/User";
import Topic from "@routes/Topic";
import Comment from "@routes/Comment";

module.exports = (app: any) => {
  const router = express.Router();

  app.use("/user", User);
  app.use("/topic", Topic);
  app.use("/comment", Comment);

  return router;
};
