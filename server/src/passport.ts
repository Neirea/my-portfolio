import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { loginGithub, loginGoogle } from "./controllers/authController";

/* STRATEGIES */
//github
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			callbackURL: "/api/auth/github/callback",
		},
		loginGithub
	)
);
//google
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: "/api/auth/google/callback",
			passReqToCallback: true,
		},
		loginGoogle
	)
);
