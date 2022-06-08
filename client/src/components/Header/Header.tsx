import { useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import {
	HeaderWrapper,
	SideMenuContainer,
	StyledMenuButton,
	MenuItem,
} from "./HeaderStyles";
import { useOutsideClick } from "../../utils/useOutsideClick";

import NavMenu from "./NavMenu";
import DisplayMode from "./DisplayMode";
import UserMenu from "./UserMenu";

const Header = () => {
	const [showNavMenu, setShowNavMenu] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const navMenuButton = useRef(null);
	useOutsideClick(navMenuButton, setShowNavMenu);

	const toggleNavMenu = () => {
		setShowNavMenu(!showNavMenu);
	};

	return (
		<HeaderWrapper>
			<MenuItem as="a" href="/">
				<h2>
					<span className="header-logo">N</span>eirea
				</h2>
			</MenuItem>

			{/* NAVBAR MENU */}
			<NavMenu showMenu={showNavMenu} setShowMenu={setShowNavMenu} />
			{/* ICON BAR WITH USER MENU */}
			<SideMenuContainer>
				{/* LOGIN/USER */}
				<UserMenu
					showUserMenu={showUserMenu}
					setShowUserMenu={setShowUserMenu}
				/>
				{/*DARK MODE */}
				<DisplayMode />
				{/* MENU BUTTON ON SMALL SCREEN */}
				<StyledMenuButton
					ref={navMenuButton}
					onClick={toggleNavMenu}
					showNavMenu={showNavMenu}
				>
					<FaBars />
				</StyledMenuButton>
			</SideMenuContainer>
		</HeaderWrapper>
	);
};

export default Header;
