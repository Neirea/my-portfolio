import { StatusCodes } from "../utils/httpStatusCodes.js";
import CustomAPIError from "./customAPIError.js";

class NotFoundError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export default NotFoundError;
