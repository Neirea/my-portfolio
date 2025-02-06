import { StatusCodes, TStatusCodes } from "../utils/http-status-codes";

class CustomAPIError extends Error {
    statusCode: TStatusCodes;
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default CustomAPIError;
