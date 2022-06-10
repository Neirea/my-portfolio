import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { loginGithub } from "./controllers/authController";

//github auth strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
		},
		loginGithub
	)
);
