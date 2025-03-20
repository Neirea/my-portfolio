import { StatusCodes, type TStatusCodes } from "../utils/httpStatusCodes.js";

class CustomAPIError extends Error {
    statusCode: TStatusCodes;
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default CustomAPIError;
