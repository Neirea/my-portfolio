import { Router } from "express";

const router = Router();

router.get("/showMe", (req, res) => {
	// console.log(req.headers);
	/* get info about user */
	console.log(req.headers);

	res.status(200);
});

export default router;
