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
import isAuthenticated from "../middleware/isAuthenticated";
import rateLimit from "../middleware/rateLimit";

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
            authorizePermissions("comments", "update"),
            checkCsrf,
        ],
        updateComment
    )
    .delete(
        [
            isAuthenticated,
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
            authorizePermissions("comments", "deleteCascade"),
            checkCsrf,
        ],
        deleteCommentsCascade
    );

export default router;
