import * as express from "express";
import User from "@routes/User";

module.exports = (app: any) => {
  const router = express.Router();

  app.use("/user", User);

  return router;
};
