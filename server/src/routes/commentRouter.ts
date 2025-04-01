import { Router } from "express";
import { RateLimiter } from "rate-limiter-algorithms";
import {
    createComment,
    deleteComment,
    deleteCommentsCascade,
    getAllComments,
    updateComment,
} from "../controllers/commentController.js";
import authorizePermissions from "../middleware/authorizePermissions.js";
import checkCsrf from "../middleware/checkCsrf.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import rateLimit from "../middleware/rateLimit.js";
import { validateData } from "../middleware/validateData.js";
import {
    commentsCreateBodySchema,
    commentsCreateParamsSchema,
    commentsDeleteManyParamsSchema,
    commentsDeleteManyQuerySchema,
    commentsDeleteParamsSchema,
    commentsDeleteQuerySchema,
    commentsGetAllParamsSchema,
    commentsUpdateBodySchema,
    commentsUpdateParamsSchema,
} from "../schemas/commentsSchemas.js";

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
            validateData({
                params: commentsCreateParamsSchema,
                body: commentsCreateBodySchema,
            }),
            checkCsrf,
        ],
        createComment,
    )
    .get(
        validateData({
            params: commentsGetAllParamsSchema,
        }),
        getAllComments,
    );

router
    .route("/:articleId/:id")
    .patch(
        [
            isAuthenticated,
            rateLimit(limiter),
            authorizePermissions("comments", "update"),
            validateData({
                params: commentsUpdateParamsSchema,
                body: commentsUpdateBodySchema,
            }),
            checkCsrf,
        ],
        updateComment,
    )
    .delete(
        [
            isAuthenticated,
            authorizePermissions("comments", "delete"),
            validateData({
                params: commentsDeleteParamsSchema,
                query: commentsDeleteQuerySchema,
            }),
            checkCsrf,
        ],
        deleteComment,
    );

router.route("/:articleId/d_all/:id").delete(
    [
        isAuthenticated,
        authorizePermissions("comments", "deleteCascade"),
        validateData({
            params: commentsDeleteManyParamsSchema,
            query: commentsDeleteManyQuerySchema,
        }),
        checkCsrf,
    ],
    deleteCommentsCascade,
);

export default router;
