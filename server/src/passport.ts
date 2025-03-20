import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { loginGithub, loginGoogle } from "./controllers/authController.js";
import { appConfig } from "./utils/appConfig.js";

if (appConfig.githubClientID && appConfig.githubClientSecret) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: appConfig.githubClientID,
                clientSecret: appConfig.githubClientSecret,
                callbackURL: "/api/auth/github/callback",
            },
            loginGithub,
        ),
    );
}

if (appConfig.googleClientID && appConfig.googleClientSecret) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: appConfig.googleClientID,
                clientSecret: appConfig.googleClientSecret,
                callbackURL: "/api/auth/google/callback",
                passReqToCallback: true,
            },
            loginGoogle,
        ),
    );
}
