import type { NextFunction, Request, Response } from "express";
import CustomError from "../errors/index.js";
import { hasPermission, type Permissions } from "../utils/abac.js";

const authorizePermissions = <Resource extends keyof Permissions>(
    resource: Resource,
    action: Permissions[Resource]["action"],
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const data = {
            ...req.params,
            ...req.query,
        } as Permissions[Resource]["dataType"];

        try {
            const isAllowed = hasPermission(
                req.session.user,
                resource,
                action,
                data,
            );
            if (!isAllowed) {
                throw new CustomError.UnauthorizedError(
                    "Unauthorized to access this route",
                );
            }
            next();
        } catch (error) {
            console.error(error);
            throw new CustomError.BadRequestError(
                "Failed to perform authorization",
            );
        }
    };
};

export default authorizePermissions;
