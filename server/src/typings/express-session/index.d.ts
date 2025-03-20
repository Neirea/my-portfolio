import "express-session";
import type { User } from "../../models/User.js";

declare module "express-session" {
    interface SessionData {
        user: User;
        csrfToken: string | undefined;
    }
}
