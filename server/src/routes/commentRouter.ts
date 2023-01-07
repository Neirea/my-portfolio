import { Router } from "express";
import { rateLimit } from "express-rate-limit";
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

const router = Router();

const commentLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: "Too many requests, please try again in 1 minute",
    },
});

router
    .route("/:articleId")
    .post([isAuthenticated, commentLimiter, checkCsrf], createComment)
    .get(getAllComments);

router
    .route("/:articleId/:id")
    .patch([isAuthenticated, commentLimiter, checkCsrf], updateComment)
    .delete([isAuthenticated, checkCsrf], deleteComment);

router
    .route("/:articleId/d_all/:id")
    .delete(
        [isAuthenticated, authorizePermissions(userRoles.admin), checkCsrf],
        deleteCommentsAdmin
    );

export default router;
