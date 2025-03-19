import { StatusCodes } from "../utils/httpStatusCodes";
import CustomAPIError from "./customAPIError";

class ServiceUnavailableError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    }
}

export default ServiceUnavailableError;
