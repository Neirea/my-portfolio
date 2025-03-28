import { FaBars } from "@react-icons/all-files/fa/FaBars";
import { useRef, useState, type JSX } from "react";
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

const Header = (): JSX.Element => {
    const [showNavMenu, setShowNavMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navMenuButton = useRef(null);
    useOutsideClick(navMenuButton, setShowNavMenu);

    const toggleNavMenu = (): void => {
        setShowNavMenu(!showNavMenu);
    };

    return (
        <HeaderWrapper>
            <MenuItem as="a" href="/" target="_self">
                <h3 className="header-logo">
                    <span className="header-logo-first">N</span>eirea
                </h3>
            </MenuItem>

            <NavMenu showMenu={showNavMenu} setShowMenu={setShowNavMenu} />
            <SideMenuContainer>
                <UserMenu
                    showUserMenu={showUserMenu}
                    setShowUserMenu={setShowUserMenu}
                />
                <DisplayMode />
                <StyledMenuButton
                    ref={navMenuButton}
                    aria-label="menu"
                    onClick={toggleNavMenu}
                    $showNavMenu={showNavMenu}
                >
                    <FaBars />
                </StyledMenuButton>
            </SideMenuContainer>
        </HeaderWrapper>
    );
};

export default Header;
