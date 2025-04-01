import { Router } from "express";
import {
    createArticle,
    deleteArticle,
    getAllArticles,
    getSingleArticle,
    updateArticle,
    uploadArticleImage,
} from "../controllers/articleController.js";
import authorizePermissions from "../middleware/authorizePermissions.js";
import checkCsrf from "../middleware/checkCsrf.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { validateData } from "../middleware/validateData.js";
import {
    articleDeleteParamsSchema,
    articleGetSingleParamsSchema,
    articleUpdateBodySchema,
    articleUpdateParamsSchema,
    uploadedArticleImageFileSchema,
} from "../schemas/articleSchemas.js";

const router = Router();

router
    .route("/")
    .post(
        [
            isAuthenticated,
            authorizePermissions("articles", "create"),
            checkCsrf,
        ],
        createArticle,
    )
    .get(getAllArticles);

router.get("/blog", getAllArticles);
router.get("/projects", getAllArticles);

router
    .route("/upload")
    .post(
        [
            isAuthenticated,
            authorizePermissions("articles", "create"),
            validateData({ files: uploadedArticleImageFileSchema }),
            checkCsrf,
        ],
        uploadArticleImage,
    );

router
    .route("/:id")
    .get(
        validateData({ params: articleGetSingleParamsSchema }),
        getSingleArticle,
    )
    .put(
        [
            isAuthenticated,
            authorizePermissions("articles", "update"),
            validateData({
                params: articleUpdateParamsSchema,
                body: articleUpdateBodySchema,
            }),
            checkCsrf,
        ],
        updateArticle,
    )
    .delete(
        [
            isAuthenticated,
            authorizePermissions("articles", "delete"),
            validateData({
                params: articleDeleteParamsSchema,
            }),
            checkCsrf,
        ],
        deleteArticle,
    );

export default router;
