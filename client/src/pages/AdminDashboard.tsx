import React from "react";
import useBanUser from "../hooks/useBanUser";

const AdminDashboard = () => {
	const { mutate: banUser } = useBanUser();
	return <main></main>;
};

export default AdminDashboard;
