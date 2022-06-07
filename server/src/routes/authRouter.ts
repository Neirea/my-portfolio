import { Router } from "express";
import passport from "passport";

const router = Router();

//login request
router.get("/login/github", (req, res) => {
	console.log("works");

	passport.authenticate("github", { session: false });
});
//callback from github
router.get(
	"/github/callback",
	passport.authenticate("github", { session: false }),
	function (req: any, res) {
		if (req.session) {
			req.session.userId = req.user.user._id;
			req.session.accessToken = req.user.accessToken;
			req.session.refreshToken = req.user.refreshToken;
		}
		// Successful authentication, redirect home.
		res.redirect(process.env.ORIGIN_URL!);
	}
);
//2023-06-07T17:46:51.437Z

//logout
router.delete("/logout", (req, res) => {
	//remove cookie
	// res
	// 	.cookie("sid", "logout", {
	// 		// httpOnly: true,
	// 		// expires: new Date(Date.now()),
	// 	})

	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.status(400).send("Unable to log out");
			}
		});
	}
	res.clearCookie("sid");
	res.status(200).json({ msg: "Log out" });

	// res.redirect(process.env.ORIGIN_URL!);
});

export default router;
