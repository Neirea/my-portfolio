import type { Request, Response, NextFunction } from "express";
import { RateLimiter } from "rate-limiter-algorithms";

const rateLimit =
    (limiter: RateLimiter) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip;

        if (!ip) {
            throw new Error("Invalid IP address");
        }
        try {
            const { isAllowed, clientData } = await limiter.consume(ip);

            // set rate limiting headers
            const headers = limiter.getHeaders(clientData);
            for (const header of headers) {
                res.setHeader(header[0], header[1]);
            }

            if (!isAllowed) {
                res.writeHead(429, "Too many requests");
                res.end(
                    JSON.stringify({
                        msg: `Too many requests. Try again in ${Math.floor(
                            limiter.windowMs / 1000
                        )} seconds`,
                    })
                );
                return;
            }
            next();
        } catch (error) {
            throw new Error(`Error in rate limiting: ${error}`);
        }
    };

export default rateLimit;
