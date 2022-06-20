import { useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiChevronDown } from "@react-icons/all-files/bi/BiChevronDown";
import { ReadButton } from "../../styles/StyledComponents";
import { UserMenuWrapper } from "./UserMenuStyles";
import { StyledMenuLink } from "./HeaderStyles";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { useGlobalContext } from "../../store/AppContext";
import { LocationState, userRoles } from "../../types/appTypes";

interface UserMenuProps {
	showUserMenu: boolean;
	setShowUserMenu: Dispatch<SetStateAction<boolean>>;
}

const UserMenu = ({ showUserMenu, setShowUserMenu }: UserMenuProps) => {
	const location = useLocation<LocationState>();
	const navigate = useNavigate();
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
			userMenuContainerRef.current.style.height = `4rem`;
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
		navigate(logoutUrl);
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
					<div style={{ display: "flex" }} ref={toggleMenuRef}>
						{user.roles.includes(userRoles.admin) ? (
							<Link className="user-name" to="/admin-dashboard">
								{user.platform_name}
							</Link>
						) : (
							<p className="user-name">{user.platform_name}</p>
						)}
						<button
							aria-label="user-menu"
							className={userMenuStyle}
							onClick={toggleUserMenu}
						>
							<div
								className="user-menu-item"
								placeholder="user name"
								title={`${user.name}`}
							>
								<img
									src={user.avatar_url}
									alt={user.name}
									width={32}
									height={32}
									style={{ width: "100%", height: "100%" }}
								/>
							</div>
							<div className="user-menu-item">
								<BiChevronDown size={"100%"} style={menuButtonStyle} />
							</div>
						</button>
					</div>

					<div className="user-menu-dropdown" ref={userMenuContainerRef}>
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
