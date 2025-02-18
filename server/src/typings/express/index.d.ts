import type { User as TUser } from "../../models/User";

declare global {
    namespace Express {
        interface User {
            user: TUser;
        }

        interface Request extends Express.Request {
            fetchedData: any;
        }
    }
}
