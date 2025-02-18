import type { NextFunction, Request, Response } from "express";
import CustomError from "../errors";
import { hasPermission, Permissions } from "../utils/abac";

const authorizePermissions = <Resource extends keyof Permissions>(
    resource: Resource,
    action: Permissions[Resource]["action"]
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let data = req.params as Permissions[Resource]["dataType"];
        if (req.fetchedData) {
            data = { ...data, fetchedData: req.fetchedData };
        }
        const isAllowed = hasPermission(
            req.session.user,
            resource,
            action,
            data
        );

        if (!isAllowed) {
            throw new CustomError.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
    };
};

export default authorizePermissions;
