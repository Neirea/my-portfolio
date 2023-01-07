import { Router } from "express";
import { banUser, getAllUsers, showMe } from "../controllers/userController";
import authorizePermissions from "../middleware/authorizePermissions";
import checkCsrf from "../middleware/checkCsrf";
import isAuthenticated from "../middleware/isAuthenticated";
import { userRoles } from "../models/User";

const router = Router();

router.get(
    "/",
    isAuthenticated,
    authorizePermissions(userRoles.admin),
    getAllUsers
);

router.get("/showMe", isAuthenticated, showMe);
router
    .route("/:id")
    .delete(
        [isAuthenticated, authorizePermissions(userRoles.admin), checkCsrf],
        banUser
    );

export default router;
