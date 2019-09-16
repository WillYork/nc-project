const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
app.use(express.json());
const {
  badRequestErrorHandler,
  internalServerErrorHandler, notFoundErrorHandler
} = require("./error-handlers");

app.use("/api", apiRouter);

app.use(notFoundErrorHandler);
app.use(badRequestErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;