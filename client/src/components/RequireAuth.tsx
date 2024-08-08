import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobalContext } from "../store/AppContext";
import { userRoles } from "../types/app.type";
import LoadingSpinner from "./LoadingSpinner";

interface RequireAuthProps {
    allowedRoles: userRoles[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { user, userLoading } = useGlobalContext();
    const location = useLocation();

    if (userLoading) {
        return <LoadingSpinner />;
    }

    if (user) {
        if (allowedRoles.some((role) => user.roles.includes(role))) {
            return <Outlet />;
        }
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
