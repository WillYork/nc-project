const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  patchArticle,
  postComment,
  getCommentsByArticleId
} = require("../controllers/articles-controller");
const { send405Error } = require("../error-handlers");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(send405Error);

module.exports = { articlesRouter };
