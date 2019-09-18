const {
  selectAllArticles,
  selectArticleById,
  updateArticle,
  updateArticleVotes,
  insertComment
} = require("../models/articles-model");

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const article_id = req.params;
  let newProp = req.body;
  if (Object.keys(newProp).length === 0) newProp = { key: "value" };
  if (Object.keys(newProp)[0] === "inc_votes") {
    updateArticleVotes(article_id, newProp)
      .then(article => {
        res.status(202).send({ article });
      })
      .catch(next);
  } else
    updateArticle(article_id, newProp)
      .then(article => {
        res.status(202).send({ article });
      })
      .catch(next);
};

exports.postComment = (req, res, next) => {
  const article_id = req.params;
  let comment = req.body;
  insertComment(article_id, comment).then(([comment]) => {
    res.status(201).send({ comment });
  });
};
