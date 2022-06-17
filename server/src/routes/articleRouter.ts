import { Router } from "express";
import { isAuthenticated, authorizePermissions } from "../middleware/auth";
import {
	getAllArticles,
	getSingleArticle,
	createArticle,
	updateArticle,
	deleteArticle,
	uploadArticleImage,
} from "../controllers/articleController";
import { userRoles } from "../models/User";

const router = Router();

router
	.route("/")
	.post([isAuthenticated, authorizePermissions(userRoles.admin)], createArticle)
	.get(getAllArticles);

router.get("/blog", getAllArticles);
router.get("/project", getAllArticles);

router
	.route("/upload")
	.post(
		[isAuthenticated, authorizePermissions(userRoles.admin)],
		uploadArticleImage
	);

router
	.route("/:id")
	.get(getSingleArticle)
	.patch(
		[isAuthenticated, authorizePermissions(userRoles.admin)],
		updateArticle
	)
	.delete(
		[isAuthenticated, authorizePermissions(userRoles.admin)],
		deleteArticle
	);

export default router;
