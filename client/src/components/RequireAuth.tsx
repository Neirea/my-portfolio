import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobalContext } from "../store/AppContext";
import LoadingSpinner from "./LoadingSpinner";

const RequireAuth = (): JSX.Element => {
    const { user, userLoading } = useGlobalContext();
    const location = useLocation();

    if (userLoading) {
        return <LoadingSpinner />;
    }

    if (user) {
        return <Outlet />;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
