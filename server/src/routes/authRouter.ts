import { Router } from "express";
import passport from "passport";
import app from "../app";
import {
    failedLogin,
    githubCallback,
    googleCallback,
    logout,
} from "../controllers/authController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = Router();

router.get("/login/failed", failedLogin);

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

router.get(
    "/github/callback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: "/api/auth/login/failed",
    }),
    githubCallback
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/login/failed",
    }),
    googleCallback
);

router.delete("/logout", isAuthenticated, logout);

export default router;
