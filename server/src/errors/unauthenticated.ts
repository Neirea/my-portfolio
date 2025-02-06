import { StatusCodes } from "../utils/http-status-codes";
import CustomAPIError from "./custom-api-error";

class UnauthenticatedError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnauthenticatedError;
