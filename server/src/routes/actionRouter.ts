import { Router } from "express";
import { RateLimiter } from "rate-limiter-algorithms";
import {
    sendContactMessage,
    testRecaptcha,
} from "../controllers/actionController";
import rateLimit from "../middleware/rateLimit";

const router = Router();

const limiter = new RateLimiter({
    algorithm: "token-bucket",
    limit: 2,
    windowMs: 30_000,
});

router.post("/sendContactMessage", rateLimit(limiter), sendContactMessage);
router.post("/testCaptcha", testRecaptcha);

export default router;
