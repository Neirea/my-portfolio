import styled from "styled-components";
import { MenuItem } from "./HeaderStyles";

export const NavMenuWrapper = styled.nav`
    position: relative;
    top: 0;

    height: 100%; //overrides height:0px from useEffect
    box-shadow: none;
    background-color: transparent;

    transition: none;
`;
export const NavMenuList = styled.ul`
    display: none;

    @media (min-width: 1000px) {
        display: flex;
        flex-direction: row;
        gap: 0;
        height: 100%;
    }
`;

export const NavMenuItem = styled(MenuItem)`
    width: 100%;

    &::before {
        display: block;
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        background: var(--faded-text-color);

        opacity: 0;
    }
    @media (hover: hover) and (pointer: fine) {
        &:hover::before {
            opacity: 0.1;
        }
    }
`;

export const MobileNavMenuWrapper = styled.nav`
    display: none;
    position: absolute;
    right: 0;
    top: calc(var(--header-height) - 1px);
    z-index: 1;

    box-shadow: var(--shadow-2);
    background-color: var(--header-bg-color);
    border-bottom-left-radius: 0.25rem;

    overflow: hidden;

    animation: growMenu 300ms ease-in-out forwards;
    transform-origin: top center;

    @keyframes growMenu {
        0% {
            transform: scaleY(0);
        }
        100% {
            transform: scaleY(1);
        }
    }

    @media (min-width: 1000px) {
        display: none;
    }
`;

export const MobileNavMenuList = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 11rem;
    margin-top: 1px;
    /* --menu-item-height: 3; */

    /* li {
        height: calc(var(--menu-item-height) * 1rem);
    } */

    @media (min-width: 1000px) {
        display: none;
    }
`;
