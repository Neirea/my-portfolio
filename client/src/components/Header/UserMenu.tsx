import { useRef, useEffect, Dispatch, SetStateAction } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import { ReadButton } from "../../styles/StyledComponents";
import { UserMenuWrapper } from "./UserMenuStyles";
import { StyledMenuLink } from "./HeaderStyles";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { useGlobalContext } from "../../store/AppContext";
import { LocationState } from "../../types/appTypes";

interface UserMenuProps {
	showUserMenu: boolean;
	setShowUserMenu: Dispatch<SetStateAction<boolean>>;
}

const UserMenu = ({ showUserMenu, setShowUserMenu }: UserMenuProps) => {
	const location = useLocation<LocationState>();
	const { user, logoutUser } = useGlobalContext();
	const userMenuContainerRef = useRef<HTMLDivElement | null>(null);
	const toggleMenuRef = useRef<HTMLDivElement | null>(null);
	useOutsideClick(toggleMenuRef, setShowUserMenu);

	// if page is refreshed or clicked multiple times
	const fromUrl = location.state?.from || location;
	const logoutUrl = location.pathname
		? location.pathname + location.search
		: "/";

	const userMenuStyle = showUserMenu
		? "toggle-user-menu  activated"
		: "toggle-user-menu";
	const menuButtonStyle = {
		transform: showUserMenu ? "rotate(180deg)" : "rotate(0)",
	};

	//shows menu on small screen
	useEffect(() => {
		if (userMenuContainerRef.current == null) return;
		if (showUserMenu) {
			userMenuContainerRef.current.style.height = `3rem`;
			return;
		}
		userMenuContainerRef.current.style.height = `0px`;
	}, [showUserMenu]);

	const toggleUserMenu = () => {
		setShowUserMenu(!showUserMenu);
	};

	const handleLogout = () => {
		showUserMenu && setShowUserMenu(false);
		logoutUser();
	};

	return (
		<UserMenuWrapper as="section">
			{!user ? (
				<StyledMenuLink
					to="/login"
					state={{ from: fromUrl }}
					title="Sign in to post comments"
					replace
				>
					Sign in
				</StyledMenuLink>
			) : (
				<>
					<div
						className={userMenuStyle}
						ref={toggleMenuRef}
						onClick={toggleUserMenu}
					>
						<p className="user-name">{user.platform_name}</p>
						<div
							className="user-menu-item"
							placeholder="user name"
							title={`${user.name}`}
						>
							<img
								className="user-avatar"
								src={user.avatar_url}
								alt={user.name}
							/>
						</div>
						<div className="user-menu-item">
							<BiChevronDown size={"100%"} style={menuButtonStyle} />
						</div>
					</div>
					<div className="user-menu-dropdown" ref={userMenuContainerRef}>
						<NavLink
							className="user-menu-link"
							to={logoutUrl}
							onClick={handleLogout}
						>
							<ReadButton>Logout</ReadButton>
						</NavLink>
					</div>
				</>
			)}
		</UserMenuWrapper>
	);
};

export default UserMenu;
