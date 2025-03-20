import { StatusCodes } from "../utils/httpStatusCodes.js";
import CustomAPIError from "./customAPIError.js";

class UnauthorizedError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export default UnauthorizedError;
