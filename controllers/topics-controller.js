const { selectAllTopics, insertTopic } = require("../models/topics-model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body
  insertTopic(newTopic)
  .then(([topic]) => {
    res.status(201).send({ topic });
  })
  .catch(next);
};