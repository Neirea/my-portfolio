import { Router } from "express";
import { banUser, getAllUsers, showMe } from "../controllers/userController.js";
import authorizePermissions from "../middleware/authorizePermissions.js";
import checkCsrf from "../middleware/checkCsrf.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { validateData } from "../middleware/validateData.js";
import { userBanParamsSchema } from "../schemas/userSchemas.js";

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
        [
            isAuthenticated,
            authorizePermissions("users", "delete"),
            validateData({ params: userBanParamsSchema }),
            checkCsrf,
        ],
        banUser,
    );

export default router;
