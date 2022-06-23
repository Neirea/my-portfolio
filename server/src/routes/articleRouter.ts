import { Router } from "express";
import {
	createArticle,
	deleteArticle,
	getAllArticles,
	getSingleArticle,
	updateArticle,
	uploadArticleImage,
} from "../controllers/articleController";
import authorizePermissions from "../middleware/authorizePermissions";
import isAuthenticated from "../middleware/isAuthenticated";
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
