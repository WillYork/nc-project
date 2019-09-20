const topicsRouter = require("express").Router();
const { getAllTopics, postTopic } = require("../controllers/topics-controller");
const { send405Error } = require("../error-handlers");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(postTopic)
  .all(send405Error);

module.exports = { topicsRouter };
