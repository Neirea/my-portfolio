import { Router } from "express";
import { isAuthenticated, authorizePermissions } from "../middleware/auth";
import {
	getAllComments,
	createComment,
	updateComment,
	deleteComment,
	deleteCommentsAdmin,
} from "../controllers/commentController";
import { rateLimit } from "express-rate-limit";
import { userRoles } from "../models/User";

const router = Router();

const commentLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 3,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		msg: "Too many requests, please try again in 1 minute",
	},
});

router
	.route("/:articleId")
	.post(isAuthenticated, commentLimiter, createComment)
	.get(getAllComments);

router
	.route("/:articleId/:id")
	.patch(isAuthenticated, commentLimiter, updateComment)
	.delete(isAuthenticated, deleteComment);

router
	.route("/:articleId/d_all/:id")
	.delete(
		[isAuthenticated, authorizePermissions(userRoles.admin)],
		deleteCommentsAdmin
	);

export default router;
