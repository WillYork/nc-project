const { connection } = require("../db/connection");

exports.selectAllTopics = () => {
  return connection.select("*").from("topics");
};

exports.insertTopic = topic => {
  return connection.insert(topic, "*").into("topics");
};
