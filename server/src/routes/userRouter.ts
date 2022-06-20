import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import authorizePermissions from "../middleware/authorizePermissions";
import { showMe, getAllUsers, banUser } from "../controllers/userController";
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
	.delete(isAuthenticated, authorizePermissions(userRoles.admin), banUser);

export default router;
