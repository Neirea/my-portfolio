import { Router, Request, Response } from "express";
import passport from "passport";
import app from "../app";
import {
	githubCallback,
	googleCallback,
	failedLogin,
	logout,
} from "../controllers/authController";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/login/failed", failedLogin);

//login request github
router.get("/login/github", (req, res, next) => {
	app.set("redirect", req.query.path);
	passport.authenticate("github", { session: false })(req, res, next);
});
router.get("/login/google", (req, res, next) => {
	app.set("redirect", req.query.path);
	passport.authenticate("google", { session: false, scope: ["profile"] })(
		req,
		res,
		next
	);
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
//callback from google
router.get(
	"/google/callback",
	passport.authenticate("google", {
		session: false,
		failureRedirect: "/api/auth/login/failed",
	}),
	googleCallback
);

//logout
router.delete("/logout", isAuthenticated, logout);

export default router;
