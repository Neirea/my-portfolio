import { Router } from "express";
import {
    createComment,
    deleteComment,
    deleteCommentsAdmin,
    getAllComments,
    updateComment,
} from "../controllers/commentController";
import authorizePermissions from "../middleware/authorizePermissions";
import checkCsrf from "../middleware/checkCsrf";
import isAuthenticated from "../middleware/isAuthenticated";
import { userRoles } from "../models/User";
import { RateLimiter } from "rate-limiter-algorithms";
import rateLimit from "../middleware/rateLimit";

const router = Router();

const limiter = new RateLimiter({
    algorithm: "token-bucket",
    limit: 5,
    windowMs: 12_000,
});

router
    .route("/:articleId")
    .post([isAuthenticated, rateLimit(limiter), checkCsrf], createComment)
    .get(getAllComments);

router
    .route("/:articleId/:id")
    .patch([isAuthenticated, rateLimit(limiter), checkCsrf], updateComment)
    .delete([isAuthenticated, checkCsrf], deleteComment);

router
    .route("/:articleId/d_all/:id")
    .delete(
        [isAuthenticated, authorizePermissions(userRoles.admin), checkCsrf],
        deleteCommentsAdmin
    );

export default router;
