import { Router } from "express";
import { isAuthenticated, authorizePermissions } from "../middleware/auth";
import {
	getAllArticles,
	getSingleArticle,
	createArticle,
	updateArticle,
	deleteArticle,
	uploadArticleImage,
	deleteArticleImage,
	getCategoryValues,
	getArticlesData,
} from "../controllers/articleController";

const router = Router();

router
	.route("/")
	.post([isAuthenticated, authorizePermissions("admin")], createArticle)
	.get(getAllArticles);

router.get("/blog", getAllArticles);
router.get("/project", getAllArticles);

router.get(
	"/articleCategories",
	[isAuthenticated, authorizePermissions("admin")],
	getCategoryValues
);
router.get("/getArticlesData", getArticlesData);

router.delete(
	"/deleteArticleImage",
	[isAuthenticated, authorizePermissions("admin")],
	deleteArticleImage
);

router
	.route("/upload")
	.post([isAuthenticated, authorizePermissions("admin")], uploadArticleImage);

router
	.route("/:id")
	.get(getSingleArticle)
	.patch([isAuthenticated, authorizePermissions("admin")], updateArticle)
	.delete([isAuthenticated, authorizePermissions("admin")], deleteArticle);

export default router;
