const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
app.use(express.json());
const {
  sqlErrorHandler,
  internalServerErrorHandler,
  customErrorHandler
} = require("./error-handlers");

app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(sqlErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
