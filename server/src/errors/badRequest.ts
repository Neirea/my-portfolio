import { StatusCodes } from "../utils/httpStatusCodes.js";
import CustomAPIError from "./customAPIError.js";

class BadRequestError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default BadRequestError;
