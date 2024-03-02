import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { getArticles } from "../../../hooks/Articles/useArticles";
import { categoriesEnum } from "../../../types/article.type";
import { menuItems } from "../../../utils/data";
import { StyledMenuLink } from "../Header.style";
import {
    MobileNavMenuList,
    MobileNavMenuWrapper,
    NavMenuItem,
    NavMenuList,
    NavMenuWrapper,
} from "./NavMenu.style";

interface NavMenuItemsProps {
    handleMenuClick?: () => void;
}
interface NavMenuProps {
    showMenu: boolean;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
}

const NavMenuItems = ({ handleMenuClick }: NavMenuItemsProps) => {
    const queryClient = useQueryClient();
    const fetchBlogs = (link: string) => {
        if (link === "/blog") {
            queryClient.prefetchQuery(["articles", categoriesEnum.blog], () =>
                getArticles(categoriesEnum.blog)
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

//One menu for sidemenu and big screen menu(just different css)
const NavMenu = ({ showMenu, setShowMenu }: NavMenuProps) => {
    const menuContainerRef = useRef<HTMLElement | null>(null);
    const menuRef = useRef<HTMLUListElement | null>(null);

    //shows menu on small screen if true
    useEffect(() => {
        if (menuContainerRef.current == null) return;
        if (showMenu) {
            menuContainerRef.current.style.display = "block";
        } else {
            menuContainerRef.current.style.display = "none";
        }
    }, [showMenu]);

    const handleMenuClick = () => {
        if (showMenu) setShowMenu(false);
    };

    return (
        <>
            {/* menu on big screen */}
            <NavMenuWrapper>
                <NavMenuList>
                    <NavMenuItems />
                </NavMenuList>
            </NavMenuWrapper>
            {/* menu on small screen */}
            <MobileNavMenuWrapper ref={menuContainerRef}>
                <MobileNavMenuList ref={menuRef}>
                    <NavMenuItems handleMenuClick={handleMenuClick} />
                </MobileNavMenuList>
            </MobileNavMenuWrapper>
        </>
    );
};

export default NavMenu;
