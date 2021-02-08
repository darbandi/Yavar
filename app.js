import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import fs from "fs";

var app = express();
// app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// get Dynamic Controller
var routePath = "./src/routes/";
fs.readdirSync(routePath).forEach(function (file) {
  var route = routePath + file;
  const address = "/" + file.replace(".router.js", "");
  const dynamicController = require(route);
  app.use(address, dynamicController.default);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    ...err,
    status: err.status,
  });
});

export default app;
