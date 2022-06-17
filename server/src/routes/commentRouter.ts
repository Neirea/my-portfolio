import { Router } from "express";
import { isAuthenticated, authorizePermissions } from "../middleware/auth";
import {
	getAllComments,
	createComment,
	updateComment,
	deleteComment,
	deleteCommentsAdmin,
} from "../controllers/commentController";
import { userRoles } from "../models/User";

const router = Router();

router
	.route("/:articleId")
	.post(isAuthenticated, createComment)
	.get(getAllComments);

router
	.route("/:articleId/:id")
	.patch(isAuthenticated, updateComment)
	.delete(isAuthenticated, deleteComment);

router
	.route("/:articleId/d_all/:id")
	.delete(
		[isAuthenticated, authorizePermissions(userRoles.admin)],
		deleteCommentsAdmin
	);

export default router;
