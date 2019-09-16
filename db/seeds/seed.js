const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex.insert(topicData).into("topics");
    })
    .then(() => {
      return knex.insert(userData).into("users");
    })
    .then(() => {
      return knex
        .insert(formatDates(articleData))
        .into("articles")
        .returning("*");
    })
    .then(insertedArticles => {
      const articleRef = makeRefObj(insertedArticles, "title", "article_id");
      const formattedComments = formatDates(
        formatComments(commentData, articleRef)
      );
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    })
    .then(console.log);
};
