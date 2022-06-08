import { useRef, useEffect, Dispatch, SetStateAction } from "react";

import { StyledMenuLink } from "./HeaderStyles";
import {
	NavMenuWrapper,
	NavMenuList,
	MobileNavMenuWrapper,
	MobileNavMenuList,
	NavMenuItem,
} from "./NavMenuStyles";
import { menuItems } from "../../utils/data";

interface NavMenuItemsProps {
	handleMenuClick: () => void;
}
interface NavMenuProps {
	showMenu: boolean;
	setShowMenu: Dispatch<SetStateAction<boolean>>;
}

const NavMenuItems = ({ handleMenuClick }: NavMenuItemsProps) => {
	return (
		<>
			{menuItems &&
				menuItems.map((item, index) => {
					const { name, link } = item;
					const isExternalLink = link.startsWith("http");
					return (
						<NavMenuItem as="li" key={index}>
							{isExternalLink ? (
								<StyledMenuLink as="a" href={link}>
									<div className="menu-link-text">{name}</div>
								</StyledMenuLink>
							) : (
								<StyledMenuLink to={link} onClick={handleMenuClick}>
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
		//get current height of list
		if (showMenu && menuRef.current != null) {
			const menuRefHeight = menuRef.current.getBoundingClientRect().height;
			menuContainerRef.current.style.height = `${menuRefHeight}px`;
			return;
		}
		menuContainerRef.current.style.height = "0px";
	}, [showMenu]);

	const handleMenuClick = () => {
		if (showMenu) setShowMenu(false);
	};

	return (
		<>
			{/* menu on big screen */}
			<NavMenuWrapper>
				<NavMenuList>
					<NavMenuItems handleMenuClick={handleMenuClick} />
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
