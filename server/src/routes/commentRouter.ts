import { Router } from "express";
import { RateLimiter } from "rate-limiter-algorithms";
import {
    createComment,
    deleteComment,
    deleteCommentsCascade,
    getAllComments,
    updateComment,
} from "../controllers/commentController";
import authorizePermissions from "../middleware/authorizePermissions";
import checkCsrf from "../middleware/checkCsrf";
import fetchResource from "../middleware/fetchResource";
import isAuthenticated from "../middleware/isAuthenticated";
import rateLimit from "../middleware/rateLimit";
import Comment from "../models/Comment";

const router = Router();

const limiter = new RateLimiter({
    algorithm: "token-bucket",
    limit: 5,
    windowMs: 12_000,
});

router
    .route("/:articleId")
    .post(
        [
            isAuthenticated,
            rateLimit(limiter),
            authorizePermissions("comments", "create"),
            checkCsrf,
        ],
        createComment
    )
    .get(getAllComments);

router
    .route("/:articleId/:id")
    .patch(
        [
            isAuthenticated,
            rateLimit(limiter),
            fetchResource(Comment),
            authorizePermissions("comments", "update"),
            checkCsrf,
        ],
        updateComment
    )
    .delete(
        [
            isAuthenticated,
            fetchResource(Comment),
            authorizePermissions("comments", "delete"),
            checkCsrf,
        ],
        deleteComment
    );

router
    .route("/:articleId/d_all/:id")
    .delete(
        [
            isAuthenticated,
            fetchResource(Comment),
            authorizePermissions("comments", "deleteCascade"),
            checkCsrf,
        ],
        deleteCommentsCascade
    );

export default router;
