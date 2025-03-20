import { StatusCodes } from "../utils/httpStatusCodes.js";
import CustomAPIError from "./customAPIError.js";

class ServiceUnavailableError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    }
}

export default ServiceUnavailableError;
