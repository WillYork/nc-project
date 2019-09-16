const { connection } = require("../db/connection");

exports.selectAllTopics = () => {
    console.log("inside model")
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};
