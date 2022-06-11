import { Router, Request, Response } from "express";
import passport from "passport";
import app from "../app";
import {
	githubCallback,
	failedLogin,
	logout,
} from "../controllers/authController";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

//idk if it works
router.get("/login/failed", failedLogin);

//login request
router.get("/login/github", (req, res, next) => {
	app.set("redirect", req.query.path);
	passport.authenticate("github", { session: false })(req, res, next);
});

//callback from github
router.get(
	"/github/callback",
	passport.authenticate("github", {
		session: false,
		failureRedirect: "/api/auth/login/failed",
	}),
	githubCallback
);

//logout
router.delete("/logout", isAuthenticated, logout);

export default router;
