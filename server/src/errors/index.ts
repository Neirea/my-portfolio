import BadRequestError from "./badRequest.js";
import CustomAPIError from "./customAPIError.js";
import NotFoundError from "./notFound.js";
import ServiceUnavailableError from "./serviceUnavailable.js";
import UnauthenticatedError from "./unauthenticated.js";
import UnauthorizedError from "./unauthorized.js";

export default {
    CustomAPIError,
    UnauthenticatedError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ServiceUnavailableError,
};
