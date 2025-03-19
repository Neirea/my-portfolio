import { StatusCodes } from "../utils/httpStatusCodes";
import CustomAPIError from "./customAPIError";

class UnauthenticatedError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnauthenticatedError;
