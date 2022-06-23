import BadRequestError from "./bad-request";
import CustomAPIError from "./custom-api-error";
import NotFoundError from "./not-found";
import ServiceUnavailableError from "./service-unavailable";
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
