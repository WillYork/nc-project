const { connection } = require("../db/connection");

exports.selectAllArticles = () => {
  return connection.select("*").from("articles");
};

exports.selectArticleById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(article => {
      if (article.length) return article;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.selectArticleById2 = article_id => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .then(comments => {
      const numberOfComments = comments.length;
      if (numberOfComments === 0)
        return Promise.reject({ status: 404, msg: "Article not found" });
      else
        return connection
          .select("*")
          .from("articles")
          .where("article_id", article_id);
    })
    .then(article => {
      console.log(article);
      console.log(numberOfComments);
      const updatedArticle = (article.comment_count = numberOfComments);
      return updatedArticle;
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
