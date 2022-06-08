import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useGlobalContext, userRoles } from "../store/AppContext";

interface RequireAuthProps {
	allowedRoles: userRoles[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
	const { user } = useGlobalContext();
	const location = useLocation();

	if (user) {
		if (allowedRoles.some((role) => user.roles.includes(role))) {
			return <Outlet />;
		}
		return <Navigate to="/unauthorized" state={{ from: location }} replace />;
	}

	return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
