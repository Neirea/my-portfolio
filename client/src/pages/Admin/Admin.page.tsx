import { FaBan } from "@react-icons/all-files/fa/FaBan";
import { FaWrench } from "@react-icons/all-files/fa/FaWrench";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useBanUser from "../../hooks/useBanUser";
import { IUser, userRoles } from "../../types/app.type";
import { AdminDashboardWrapper } from "./Admin.style";

const Admin = () => {
    const { mutate: banUser } = useBanUser();
    const { data: users } = useQuery<IUser[]>(["users"], () =>
        axios.get("/api/user").then((res) => res.data.users)
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
                    return (
                        !user.roles.includes(userRoles.admin) && (
                            <div className="user-container">
                                <div>{user.platform_id}</div>
                                <div>{user.platform_name}</div>
                                <div>{user.name}</div>
                                <img
                                    className="user-image"
                                    src={user.avatar_url}
                                    width={32}
                                    height={32}
                                    referrerPolicy="no-referrer"
                                    alt={user.name}
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
                        )
                    );
                })}
        </AdminDashboardWrapper>
    );
};

export default Admin;
