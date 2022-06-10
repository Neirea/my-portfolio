import { Request, Response } from "express";

export const githubCallback = (req: any, res: Response) => {
	// transform to object from mongoose and remove __v field from user
	const { __v, ...user } = req.user.user.toObject();

	if (req.session) {
		req.session.user = user;
		req.session.accessToken = req.user.accessToken;
	}

	// Successful authentication, redirect to page where user specifies username
	res.redirect(process.env.CLIENT_URL!);
};

export const failedLogin = (req: Request, res: Response) => {
	console.log("failed");

	res.status(401).json({
		success: false,
		message: "Authentication failed",
	});
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
