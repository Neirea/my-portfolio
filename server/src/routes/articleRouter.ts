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
import checkCsrf from "../middleware/checkCsrf";
import isAuthenticated from "../middleware/isAuthenticated";

const router = Router();

router
    .route("/")
    .post(
        [
            isAuthenticated,
            authorizePermissions("articles", "create"),
            checkCsrf,
        ],
        createArticle
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
            checkCsrf,
        ],
        uploadArticleImage
    );

router
    .route("/:id")
    .get(getSingleArticle)
    .put(
        [
            isAuthenticated,
            authorizePermissions("articles", "update"),
            checkCsrf,
        ],
        updateArticle
    )
    .delete(
        [
            isAuthenticated,
            authorizePermissions("articles", "delete"),
            checkCsrf,
        ],
        deleteArticle
    );

export default router;
