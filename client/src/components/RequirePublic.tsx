import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobalContext } from "../store/AppContext";

const RequirePublic = () => {
	const { user } = useGlobalContext();
	const location = useLocation();

	return !user ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};

export default RequirePublic;
