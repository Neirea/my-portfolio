import { StatusCodes, TStatusCodes } from "../utils/httpStatusCodes";

class CustomAPIError extends Error {
    statusCode: TStatusCodes;
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default CustomAPIError;
