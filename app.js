const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  sqlErrorHandler,
  internalServerErrorHandler,
  customErrorHandler,
  send405Error
} = require("./error-handlers");
const cors = require('cors')
app.use(cors())
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send("Path not found");
});

app.use(customErrorHandler);
app.use(sqlErrorHandler);
app.use(send405Error);
app.use(internalServerErrorHandler);

module.exports = app;
