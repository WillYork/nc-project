const { connection } = require("../db/connection");

exports.selectAllArticles = () => {
  return connection.select("*").from("articles");
};

exports.selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comment_id" })
    .then(article => {
      if (article.length) return article;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.updateArticle = (article_id, newProp) => {
  return connection("articles")
    .where(article_id)
    .update({ newProp })
    .returning("*")
    .then(article => {
      if (article.length) return article;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.updateArticleVotes = (article_id, { inc_votes }) => {
  return connection("articles")
    .where(article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (article.length) return article;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.insertComment = ({ article_id }, comment) => {
  const { username, body } = comment;
  commentObj = {
    author: username,
    article_id,
    body: body
  };
  return connection.insert(commentObj, "*").into("comments");
};
