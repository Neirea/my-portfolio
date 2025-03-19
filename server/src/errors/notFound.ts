import { StatusCodes } from "../utils/httpStatusCodes";
import CustomAPIError from "./customAPIError";

class NotFoundError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export default NotFoundError;
