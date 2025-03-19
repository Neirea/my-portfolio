import { FaBan } from "@react-icons/all-files/fa/FaBan";
import { FaWrench } from "@react-icons/all-files/fa/FaWrench";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useBanUser from "../../hooks/useBanUser";
import type { User } from "../../types/abac.type";
import { AdminDashboardWrapper } from "./AdminDashboard.style";
import { useGlobalContext } from "../../store/AppContext";
import { hasPermission } from "../../utils/abac";

const AdminDashboard = (): JSX.Element => {
    const { user: currentUser } = useGlobalContext();
    const { mutate: banUser } = useBanUser();
    const { data: users } = useQuery<User[]>(["users"], () =>
        axios.get<{ users: User[] }>("/api/user").then((res) => res.data.users),
    );

    return (
        <AdminDashboardWrapper>
            <div className="users-title">
                <div>Platform Id</div>
                <div>Platform Name</div>
                <div>Name</div>

                <div>Avatar</div>
                <div>isBanned</div>
            </div>
            {users &&
                users.map((user) => {
                    if (!hasPermission(currentUser, "users", "delete", user)) {
                        return null;
                    }
                    return (
                        <div className="user-container" key={user._id}>
                            <div>{user.platform_id}</div>
                            <div>{user.platform_name}</div>
                            <div>{user.name}</div>
                            <img
                                className="user-image"
                                src={user.avatar_url}
                                width={32}
                                height={32}
                                referrerPolicy="no-referrer"
                                alt={`${user.name} avatar`}
                            />
                            <div className="user-ban-container">
                                <span>{user.isBanned.toString()}</span>
                                <button
                                    className="user-ban"
                                    onClick={() => banUser(user._id)}
                                >
                                    {user.isBanned ? (
                                        <FaWrench size={"100%"} />
                                    ) : (
                                        <FaBan size={"100%"} />
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
        </AdminDashboardWrapper>
    );
};

export default AdminDashboard;
