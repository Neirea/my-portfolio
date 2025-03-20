import {
    type NextFunction,
    type Request,
    type Response,
    Router,
} from "express";
import passport from "passport";
import app from "../app.js";
import {
    failedLogin,
    githubCallback,
    googleCallback,
    logout,
} from "../controllers/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

type PassportAuthenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
) => void;

router.get("/login/failed", failedLogin);

router.get("/login/github", (req, res, next) => {
    app.set("redirect", req.query.path);
    (
        passport.authenticate("github", {
            session: false,
        }) as PassportAuthenticate
    )(req, res, next);
});

router.get("/login/google", (req, res, next) => {
    app.set("redirect", req.query.path);
    (
        passport.authenticate("google", {
            session: false,
            scope: ["profile"],
        }) as PassportAuthenticate
    )(req, res, next);
});

router.get(
    "/github/callback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: "/api/auth/login/failed",
    }) as PassportAuthenticate,
    githubCallback,
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/login/failed",
    }) as PassportAuthenticate,
    googleCallback,
);

router.delete("/logout", isAuthenticated, logout);

export default router;
