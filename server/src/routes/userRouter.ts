import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import authorizePermissions from "../middleware/authorizePermissions";
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

export default router;
