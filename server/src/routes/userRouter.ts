import { Router } from "express";
import { banUser, getAllUsers, showMe } from "../controllers/userController.js";
import authorizePermissions from "../middleware/authorizePermissions.js";
import checkCsrf from "../middleware/checkCsrf.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

router.get(
    "/",
    isAuthenticated,
    authorizePermissions("users", "read"),
    getAllUsers,
);

router.get("/showMe", isAuthenticated, showMe);
router
    .route("/:id")
    .delete(
        [isAuthenticated, authorizePermissions("users", "delete"), checkCsrf],
        banUser,
    );

export default router;
