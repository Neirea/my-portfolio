import { Request, Response } from "express";
import { Profile } from "passport-github2";
import CustomError from "../errors";
import User from "../models/User";

export const failedLogin = (req: Request, res: Response) => {
	res
		.status(401)
		.redirect(`${process.env.CLIENT_URL}/login?error=login_failed`);
};

export const logout = (req: Request, res: Response) => {
	if (req.session) {
		//deletes from session from mongoDB too
		req.session.destroy((err) => {
			if (err) {
				res.status(400).send("Unable to log out");
			}
		});
	}
	res.clearCookie("sid");
	res.status(200).json({ msg: "Log out" });
};

export const githubCallback = (req: Request, res: Response) => {
	// transform to object from mongoose and remove __v field from user
	if (!req.user) {
		throw new CustomError.BadRequestError("Authentication error. User error!");
	}
	if (req.session) {
		req.session.user = req.user.user;
		req.session.accessToken = req.user.accessToken;
	}

	// Successful authentication, redirect to page where user specifies username
	res.redirect(process.env.CLIENT_URL!);
};

interface GithubUserProfile extends Profile {
	_json: {
		[key: string]: string;
	};
}

export const loginGithub = async (
	accessToken: string | undefined,
	refreshToken: string | undefined,
	profile: GithubUserProfile,
	done: (err: any, id?: unknown) => void
) => {
	//check if user is in DB, if not -> create one
	let user = await User.findOne({ id: profile.id, type: "github" });
	if (!user) {
		const { username, displayName, _json } = profile;
		const isFirstAccount = (await User.countDocuments({})) === 0;
		user = await User.create({
			platform_name: username,
			platform_type: "github",
			name: displayName || "User1337",
			roles: isFirstAccount ? ["admin", "user"] : ["user"],
			avatar_url: _json.avatar_url,
		});
	}
	user = user.toObject();
	done(null, { user, accessToken, refreshToken });
};
