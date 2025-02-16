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
        [isAuthenticated, authorizePermissions("admin"), checkCsrf],
        createArticle
    )
    .get(getAllArticles);

router.get("/blog", getAllArticles);
router.get("/projects", getAllArticles);

router
    .route("/upload")
    .post(
        [isAuthenticated, authorizePermissions("admin"), checkCsrf],
        uploadArticleImage
    );

router
    .route("/:id")
    .get(getSingleArticle)
    .put(
        [isAuthenticated, authorizePermissions("admin"), checkCsrf],
        updateArticle
    )
    .delete(
        [isAuthenticated, authorizePermissions("admin"), checkCsrf],
        deleteArticle
    );

export default router;
