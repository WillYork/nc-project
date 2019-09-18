const { connection } = require("../db/connection");

exports.selectAllArticles = (sort_by, order_by, username, topic) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comment_id" })
    .orderBy(sort_by || "created_at", order_by || "asc")
    .modify(query => {
      if (username) return query.where({ "articles.author": username });
      if (topic) return query.where({ topic });
    });
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
    .update(newProp)
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
  return connection
    .insert(commentObj, "*")
    .into("comments")
    .then(comment => {
      if (comment.length) return comment;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.selectCommentsByArticleId = ({ article_id }, sort_by, order_by) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order_by || "asc")
    .then(commentArray => {
      return commentArray.map(comment => {
        const newComment = { ...comment };
        delete newComment.article_id;
        return newComment;
      });
    })
    .then(comments => {
      if (comments.length) return comments;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};
