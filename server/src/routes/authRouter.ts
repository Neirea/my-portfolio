import { Router } from "express";
import passport from "passport";
import {
	githubCallback,
	failedLogin,
	logout,
} from "../controllers/authController";

const router = Router();

//idk if it works
router.get("/login/failed", failedLogin);

//login request
router.get(
	"/login/github",
	passport.authenticate("github", { session: false })
);

//callback from github
router.get(
	"/github/callback",
	passport.authenticate("github", {
		session: false,
		failureRedirect: "/login/failed",
	}),
	githubCallback
);

//logout
router.delete("/logout", logout);

export default router;
