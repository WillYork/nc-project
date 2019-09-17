const articlesRouter = require("express").Router();
const { getAllArticles, getArticleById, patchArticle } = require("../controllers/articles-controller");

articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle)

module.exports = { articlesRouter };
