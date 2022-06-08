import { Router } from "express";
import {
	sendContactMessage,
	testRecaptcha,
} from "../controllers/actionController";

const router = Router();

router.post("/sendContactMessage", sendContactMessage);
router.post("/testCaptcha", testRecaptcha);

export default router;
