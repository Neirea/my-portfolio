import { Router } from "express";
import { isAuthenticated, authorizePermissions } from "../middleware/auth";
import { showMe, banUser } from "../controllers/userController";
import { userRoles } from "../models/User";

const router = Router();

router.get("/showMe", isAuthenticated, showMe);
router.delete(
	"/:id",
	isAuthenticated,
	authorizePermissions(userRoles.admin),
	banUser
);

/* delete account route? */

export default router;
