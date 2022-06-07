import { Profile } from "passport-github2";
import User from "./models/User";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

interface GithubUserProfile extends Profile {
	_json: {
		[key: string]: string;
	};
}
const loginGithub = async (
	accessToken: any,
	refreshToken: any,
	profile: GithubUserProfile,
	done: any
) => {
	//check if user is in DB, if not -> create one
	let user = await User.findOne({ github_id: profile.id });
	if (!user) {
		console.log("new User");

		const { id, displayName, _json } = profile;
		const isFirstAccount = (await User.countDocuments({})) === 0;
		user = await User.create({
			github_id: id,
			name: displayName || "User1337",
			role: isFirstAccount ? "admin" : "user",
			avatar_url: _json.avatar_url,
		});
	}

	done(null, { user, accessToken, refreshToken });
};

//github auth strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`, //env var for base server url?
		},
		loginGithub
	)
);
