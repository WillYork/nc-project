const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  sqlErrorHandler,
  internalServerErrorHandler,
  customErrorHandler
} = require("./error-handlers");
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send("Path not found");
});

app.use(customErrorHandler);
app.use(sqlErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
