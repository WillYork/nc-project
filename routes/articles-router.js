const articlesRouter = require("express").Router();
const { getAllArticles, getArticleById, patchArticle, postComment } = require("../controllers/articles-controller");

articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle)
articlesRouter.route("/:article_id/comments").post(postComment)

module.exports = { articlesRouter };
