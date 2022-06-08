import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
	statusCode?: StatusCodes;
	constructor(message: string) {
		super(message);
	}
}

export default CustomAPIError;
