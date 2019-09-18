const apiRouter = require("express").Router();
const { topicsRouter } = require("./topics-router");
const { usersRouter } = require("./users-router");
const { articlesRouter } = require("./articles-router");
const { commentsRouter } = require("./comments-router");
const endpoints = require("../endpoints.json");
const { send405Error } = require("../error-handlers");

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.send(endpoints);
  })
  .all(send405Error);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
