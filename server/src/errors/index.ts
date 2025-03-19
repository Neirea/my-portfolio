import BadRequestError from "./badRequest";
import CustomAPIError from "./customAPIError";
import NotFoundError from "./notFound";
import ServiceUnavailableError from "./serviceUnavailable";
import UnauthenticatedError from "./unauthenticated";
import UnauthorizedError from "./unauthorized";

export default {
    CustomAPIError,
    UnauthenticatedError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ServiceUnavailableError,
};
