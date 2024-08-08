import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobalContext } from "../store/AppContext";
import LoadingSpinner from "./LoadingSpinner";

const RequirePublic = () => {
    const { user, userLoading } = useGlobalContext();
    const location = useLocation();

    if (userLoading) {
        return <LoadingSpinner />;
    }

    return !user ? (
        <Outlet />
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
};

export default RequirePublic;
