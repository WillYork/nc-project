const { connection } = require("../db/connection");

exports.selectAllArticles = () => {
  return connection
    .select("*")
    .from("articles")
    .returning("*");
};

exports.selectArticleById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .returning("*")
    .then(article => {
      if (article.length) return article;
      else return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

exports.updateArticle = (article_id, newProp) => {
    return connection("articles").where(article_id).update(newProp, "*").then(article => {
        if(article.length) return article
        else return Promise.reject({status: 404, msg: "Article not found"})
    })
}