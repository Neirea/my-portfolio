import type { JSX } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useGlobalContext } from "../store/AppContext";
import type { Permissions } from "../types/abac.type";
import { hasPermission } from "../utils/abac";

const RequirePermission = <Resource extends keyof Permissions>({
    resource,
    action,
}: {
    resource: Resource;
    action: Permissions[Resource]["action"];
}): JSX.Element => {
    const { user } = useGlobalContext();
    const location = useLocation();

    if (hasPermission(user, resource, action)) {
        return <Outlet />;
    }

    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default RequirePermission;
