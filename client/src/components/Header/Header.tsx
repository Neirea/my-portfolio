import { FaBars } from "@react-icons/all-files/fa/FaBars";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../utils/useOutsideClick";
import {
    HeaderWrapper,
    MenuItem,
    SideMenuContainer,
    StyledMenuButton,
} from "./Header.style";

import DisplayMode from "./DisplayMode/DisplayMode";
import NavMenu from "./NavMenu/NavMenu";
import UserMenu from "./UserMenu/UserMenu";

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
            <MenuItem as="a" href="/" target="_self">
                <h3 className="header-logo">
                    <span className="header-logo-first">N</span>eirea
                </h3>
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
                    aria-label="menu"
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
