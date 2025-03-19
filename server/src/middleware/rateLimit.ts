import type { NextFunction, Request, Response } from "express";
import { RateLimiter } from "rate-limiter-algorithms";

const rateLimit =
    (limiter: RateLimiter) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const ip = req.ip;

        if (!ip) {
            throw new Error("Invalid IP address");
        }
        try {
            const { isAllowed, clientData } = await limiter.consume(ip);

            const headers = limiter.getHeaders(clientData);
            for (const header of headers) {
                res.setHeader(header[0], header[1]);
            }

            if (!isAllowed) {
                res.status(429).json({
                    msg: `Too many requests. Try again in ${Math.floor(
                        limiter.windowMs / 1000,
                    )} seconds`,
                });
                return;
            }
            next();
        } catch (error) {
            throw new Error(
                `Error in rate limiting: ${(error as Error).message}`,
            );
        }
    };

export default rateLimit;
