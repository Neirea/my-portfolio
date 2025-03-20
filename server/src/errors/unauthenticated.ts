import { StatusCodes } from "../utils/httpStatusCodes.js";
import CustomAPIError from "./customAPIError.js";

class UnauthenticatedError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnauthenticatedError;
