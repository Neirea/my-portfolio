import { Router } from "express";
import {
	sendContactMessage,
	testRecaptcha,
} from "../controllers/actionController";
import { rateLimit } from "express-rate-limit";

const router = Router();

const emailLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 1,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		msg: "Too many requests, please try again in 1 minute",
	},
});

router.post("/sendContactMessage", emailLimiter, sendContactMessage);
router.post("/testCaptcha", testRecaptcha);

export default router;
