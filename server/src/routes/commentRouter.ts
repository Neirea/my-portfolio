import { Router } from "express";
import { isAuthenticated, authorizePermissions } from "../middleware/auth";
import {
	getAllComments,
	getSingleComment,
	createComment,
	updateComment,
	deleteComment,
	deleteCommentsAdmin,
} from "../controllers/commentController";
import { userRoles } from "../config";

const router = Router();

router
	.route("/:article")
	.post(isAuthenticated, createComment)
	.get(getAllComments);

router
	.route("/:article/:id")
	.get(getSingleComment)
	.patch(isAuthenticated, updateComment)
	.delete(isAuthenticated, deleteComment);

router
	.route("/:article/d_all/:id")
	.delete(
		[isAuthenticated, authorizePermissions(userRoles.admin)],
		deleteCommentsAdmin
	);

export default router;
