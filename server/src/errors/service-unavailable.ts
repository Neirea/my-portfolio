import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api-error";

class ServiceUnavailableError extends CustomAPIError {
	statusCode: StatusCodes;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
	}
}

export default ServiceUnavailableError;
