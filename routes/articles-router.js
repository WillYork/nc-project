const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  patchArticle,
  postComment,
  getCommentsByArticleId,
  postArticle,
  deleteArticle
} = require("../controllers/articles-controller");
const { send405Error } = require("../error-handlers");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(send405Error);

module.exports = { articlesRouter };
