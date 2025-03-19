import { StatusCodes } from "../utils/httpStatusCodes";
import CustomAPIError from "./customAPIError";

class UnauthorizedError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export default UnauthorizedError;
