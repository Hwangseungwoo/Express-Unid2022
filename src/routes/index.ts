import * as express from "express";
import User from "@routes/User";
import Topic from "@routes/Topic";

module.exports = (app: any) => {
  const router = express.Router();

  app.use("/user", User);
  app.use("/topic", Topic);

  return router;
};
