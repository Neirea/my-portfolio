import { BiChevronDown } from "@react-icons/all-files/bi/BiChevronDown";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../store/AppContext";
import { ReadButton } from "../../../styles/styled-components";
import { LocationState, userRoles } from "../../../types/app.type";
import { useOutsideClick } from "../../../utils/useOutsideClick";
import { StyledMenuLink } from "../Header.style";
import { UserMenuWrapper } from "./UserMenu.style";

interface UserMenuProps {
    showUserMenu: boolean;
    setShowUserMenu: Dispatch<SetStateAction<boolean>>;
}

const UserMenu = ({ showUserMenu, setShowUserMenu }: UserMenuProps) => {
    const location = useLocation<LocationState>();
    const navigate = useNavigate();
    const { user, logoutUser, userLoading } = useGlobalContext();
    const userMenuContainerRef = useRef<HTMLDivElement | null>(null);
    const toggleMenuRef = useRef<HTMLDivElement | null>(null);
    useOutsideClick(toggleMenuRef, setShowUserMenu);

    // if page is refreshed or clicked multiple times
    const fromUrl = location.state?.from || location;
    const logoutUrl = location.pathname
        ? location.pathname + location.search
        : "/";

    const userMenuStyle = showUserMenu
        ? "toggle-user-menu activated"
        : "toggle-user-menu";
    const menuButtonStyle = {
        transform: showUserMenu ? "rotate(180deg)" : "rotate(0)",
    };

    //shows menu on small screen if true
    useEffect(() => {
        if (userMenuContainerRef.current == null) return;
        if (showUserMenu) {
            userMenuContainerRef.current.style.display = "flex";
        } else {
            userMenuContainerRef.current.style.display = "none";
        }
    }, [showUserMenu]);

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleLogout = () => {
        showUserMenu && setShowUserMenu(false);
        logoutUser();
        navigate(logoutUrl);
    };

    if (userLoading) {
        return <UserMenuWrapper as="section" />;
    }

    return (
        <UserMenuWrapper as="section">
            {!user ? (
                <div
                    style={{
                        display: "inline-block",
                    }}
                >
                    <StyledMenuLink
                        to="/login"
                        state={{ from: fromUrl }}
                        title="Sign in to post comments"
                        replace
                    >
                        Sign in
                    </StyledMenuLink>
                </div>
            ) : (
                <>
                    <div className="user-menu-group" ref={toggleMenuRef}>
                        {user.roles.includes(userRoles.admin) ? (
                            <Link
                                className="user-name admin-link"
                                to="/admin-dashboard"
                            >
                                {user.name}
                            </Link>
                        ) : (
                            <p className="user-name">{user.name}</p>
                        )}
                        <button
                            aria-label="user-menu"
                            className={userMenuStyle}
                            onClick={toggleUserMenu}
                        >
                            <div
                                className="user-menu-item"
                                aria-label="user name"
                                title={`${user.platform_name}`}
                            >
                                <img
                                    className="user-menu-avatar"
                                    src={user.avatar_url}
                                    alt="user avatar"
                                    width={32}
                                    height={32}
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            <div className="user-menu-item">
                                <BiChevronDown
                                    size={"100%"}
                                    style={menuButtonStyle}
                                />
                            </div>
                        </button>
                    </div>

                    <div
                        className="user-menu-dropdown"
                        ref={userMenuContainerRef}
                    >
                        <ReadButton
                            className="user-menu-link"
                            disabled={!showUserMenu}
                            onClick={handleLogout}
                        >
                            Logout
                        </ReadButton>
                    </div>
                </>
            )}
        </UserMenuWrapper>
    );
};

export default UserMenu;
