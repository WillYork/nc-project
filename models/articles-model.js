const { connection } = require("../db/connection");

checkThingExists = (query, columnName, table) => {
  return connection
    .first("*")
    .from(table)
    .where({ [columnName]: query })
    .then(thing => {
      if (!thing) {
        return Promise.reject({
          status: 404,
          msg: `${columnName} does not exist`
        });
      }
      return true;
    });
};

exports.selectAllArticles = (sort_by, order_by, username, topic, limit = 10, p) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comment_id" })
    .orderBy(sort_by || "created_at", order_by || "desc")
    .limit(limit)
    .offset((p - 1) * limit)
    .modify(query => {
      if (username && topic) {
        return query.where({ "articles.author": username, topic });
      }
      if (username) return query.where({ "articles.author": username });
      if (topic) return query.where({ topic });
    })
    .then(articles => {
      if (!articles.length && username) {
        return Promise.all([
          articles,
          checkThingExists(username, "username", "users")
        ]);
      } else if (!articles.length && topic) {
        return Promise.all([
          articles,
          checkThingExists(topic, "slug", "topics")
        ]);
      }
      return [articles];
    })
    .then(([articles]) => {
      return articles;
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
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then(article => {
      if (article.length) return article;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.insertArticle = article => {
  return connection
    .insert(article, "*")
    .into("articles")
    .then(article => {
      return article;
    });
};

exports.insertComment = ({ article_id }, comment) => {
  const { username, body } = comment;
  commentObj = {
    author: username,
    article_id,
    body
  };
  return connection
    .insert(commentObj, "*")
    .into("comments")
    .then(comment => {
      if (comment.length) return comment;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.selectCommentsByArticleId = (
  { article_id },
  sort_by,
  order_by,
  limit,
  p
) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order_by || "desc")
    .limit(limit || 10)
    .offset((p - 1) * limit)
    .then(comments => {
      if (!comments.length && article_id) {
        return Promise.all([
          comments,
          checkThingExists(article_id, "article_id", "articles")
        ]);
      }
      return [comments];
    })
    .then(([comments]) => {
      return comments.map(comment => {
        const newComment = { ...comment };
        delete newComment.article_id;
        return newComment;
      });
    })
    .then(comments => {
      return comments;
    });
};

exports.removeArticle = article_id => {
  return connection("articles")
    .where({ article_id })
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Article not found" });
    });
};
