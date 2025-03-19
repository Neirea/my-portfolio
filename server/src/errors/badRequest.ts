import { StatusCodes } from "../utils/httpStatusCodes";
import CustomAPIError from "./customAPIError";

class BadRequestError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default BadRequestError;
