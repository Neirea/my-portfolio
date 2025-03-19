import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { getArticles } from "../../../hooks/Articles/useArticles";
import { menuItems } from "../../../utils/data";
import { StyledMenuLink } from "../Header.style";
import {
    MobileNavMenuList,
    MobileNavMenuWrapper,
    NavMenuItem,
    NavMenuList,
    NavMenuWrapper,
} from "./NavMenu.style";

type NavMenuItemsProps = {
    handleMenuClick?: () => void;
};
type NavMenuProps = {
    showMenu: boolean;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
};

const NavMenuItems = ({ handleMenuClick }: NavMenuItemsProps): JSX.Element => {
    const queryClient = useQueryClient();

    const fetchBlogs = (link: string): void => {
        if (link === "/blog") {
            void queryClient.prefetchQuery(["articles", "blog"], () =>
                getArticles("blog"),
            );
        }
    };
    return (
        <>
            {menuItems &&
                menuItems.map((item, index) => {
                    const { name, link } = item;
                    const isExternalLink = link.startsWith("http");
                    return (
                        <NavMenuItem as="li" key={index}>
                            {isExternalLink ? (
                                <StyledMenuLink as="a" to={link}>
                                    <div className="menu-link-text">{name}</div>
                                </StyledMenuLink>
                            ) : (
                                <StyledMenuLink
                                    to={link}
                                    onClick={handleMenuClick}
                                    onMouseEnter={() => fetchBlogs(link)}
                                >
                                    <div className="menu-link-text">{name}</div>
                                </StyledMenuLink>
                            )}
                        </NavMenuItem>
                    );
                })}
        </>
    );
};

const NavMenu = ({ showMenu, setShowMenu }: NavMenuProps): JSX.Element => {
    const menuContainerRef = useRef<HTMLElement | null>(null);
    const menuRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (menuContainerRef.current == null) return;
        if (showMenu) {
            menuContainerRef.current.style.display = "block";
        } else {
            menuContainerRef.current.style.display = "none";
        }
    }, [showMenu]);

    const handleMenuClick = (): void => {
        if (showMenu) setShowMenu(false);
    };

    return (
        <>
            <NavMenuWrapper>
                <NavMenuList>
                    <NavMenuItems />
                </NavMenuList>
            </NavMenuWrapper>
            <MobileNavMenuWrapper ref={menuContainerRef}>
                <MobileNavMenuList ref={menuRef}>
                    <NavMenuItems handleMenuClick={handleMenuClick} />
                </MobileNavMenuList>
            </MobileNavMenuWrapper>
        </>
    );
};

export default NavMenu;
