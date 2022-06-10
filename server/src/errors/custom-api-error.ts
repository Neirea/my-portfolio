import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
	statusCode: StatusCodes;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export default CustomAPIError;
