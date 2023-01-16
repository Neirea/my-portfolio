import { FaBan } from "@react-icons/all-files/fa/FaBan";
import { FaWrench } from "@react-icons/all-files/fa/FaWrench";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import styled, { css } from "styled-components";
import useBanUser from "../hooks/useBanUser";
import { IUser, userRoles } from "../types/appTypes";

const AdminDashboard = () => {
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

const sharedStyle = css`
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-columns: repeat(5, 20%);
    width: 80%;
`;

const AdminDashboardWrapper = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 5rem;

    .users-title {
        ${sharedStyle}
        font-weight: 600;
    }
    .user-container {
        ${sharedStyle}

        height: 3rem;
        background: var(--article-bg-color);
        box-shadow: var(--shadow-1);
    }
    .user-image {
        width: 2rem;
        aspect-ratio: 1/1;
    }
    .user-ban-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    .user-ban {
        display: block;
        position: relative;
        width: 2rem;
        height: 2rem;

        color: var(--faded-text-color);
        &:hover {
            color: var(--main-text-color);
        }
    }
`;

export default AdminDashboard;
