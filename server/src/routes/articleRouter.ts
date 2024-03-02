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
import { userRoles } from "../models/User";

const router = Router();

router
    .route("/")
    .post(
        [isAuthenticated, authorizePermissions(userRoles.admin), checkCsrf],
        createArticle
    )
    .get(getAllArticles);

router.get("/blog", getAllArticles);
router.get("/projects", getAllArticles);

router
    .route("/upload")
    .post(
        [isAuthenticated, authorizePermissions(userRoles.admin), checkCsrf],
        uploadArticleImage
    );

router
    .route("/:id")
    .get(getSingleArticle)
    .put(
        [isAuthenticated, authorizePermissions(userRoles.admin), checkCsrf],
        updateArticle
    )
    .delete(
        [isAuthenticated, authorizePermissions(userRoles.admin), checkCsrf],
        deleteArticle
    );

export default router;
