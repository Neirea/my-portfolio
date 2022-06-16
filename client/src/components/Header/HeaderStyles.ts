import styled from "styled-components";
import { NavLink } from "react-router-dom";

interface StyledMenuButtonProps {
	showNavMenu: boolean;
}

export const HeaderWrapper = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;

	position: sticky;
	top: 0px;
	padding-left: 5%;
	z-index: 1;

	height: 4rem;
	box-shadow: 0 0 1rem -0.5rem rgb(85, 0, 170, 0.5);
	background-color: var(--header-bg-color);

	text-align: center;

	@media (min-width: 1000px) {
		padding: 0 10%;
	}
`;
export const MenuItem = styled.div`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	height: 100%;
	.header-logo {
		font-size: inherit;
		color: var(--button-color);
	}
`;

// button on small screen that toggles menu
export const StyledMenuButton = styled.button<StyledMenuButtonProps>`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	aspect-ratio: 1/1.5;
	border: none;
	& > svg {
		color: ${(props) =>
			props.showNavMenu ? "var(--main-text-color)" : "var(--faded-text-color)"};
		transform: ${(props) =>
			props.showNavMenu ? "rotate(90deg)" : "rotate(0)"};
		transition: transform var(--transition);
	}
	background-color: var(--header-bg-color);

	cursor: pointer;

	@media (min-width: 1000px) {
		display: none;
	}
`;

//user-menu + darkmode
export const SideMenuContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: 100%;
`;

export const StyledMenuLink = styled(NavLink)`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	padding: 0.5rem;
	color: var(--faded-text-color);
	z-index: 1;

	/* animation on menu being active */
	&::after {
		content: "";
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;

		margin: auto;
		height: 2px;
		width: 0px;
		background: transparent;
		transition: var(--header-transition);
	}
	@media (hover: hover) and (pointer: fine) {
		&:hover,
		&:focus {
			color: var(--main-text-color);
			transition: color var(--transition);
		}
	}
	/* current link is active */
	&[class*="active"] {
		color: var(--main-text-color);
	}
	&[class*="active"]::after {
		content: "";
		display: block;
		margin: auto;
		height: 2px;
		width: 50%;
		background: var(--button-color);
	}
`;
