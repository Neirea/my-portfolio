import "express-session";

declare module "express-session" {
    interface SessionData {
        user: import("../../models/User").IUser;
        csrfToken: string | undefined;
    }
}
