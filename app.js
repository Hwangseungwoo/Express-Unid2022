require("dotenv").config({ path: `${__dirname}/config.env` });
require("module-alias/register");
let createError = require("http-errors");
let express = require("express");
let cookieParser = require("cookie-parser");
const indexRouter = require("./build/routes");
const cors = require("cors");

let app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// router
app.use("/", indexRouter(app));

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);

  if (err.status !== 404) {
    console.error(err);
  }

  return res.json({
    code: -1,
    message: err.name === "Error" ? err.message : undefined,
  });
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  next();
});

app.listen(process.env.NODE_ENV !== "test" ? 5200 : 5201);

module.exports = app;
