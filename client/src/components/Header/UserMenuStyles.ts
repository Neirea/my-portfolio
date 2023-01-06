import styled from "styled-components";
import { MenuItem } from "./HeaderStyles";

export const UserMenuWrapper = styled(MenuItem)`
    display: flex;
    margin-right: 0.5rem;
    color: var(--faded-text-color);

    .user-name {
        display: none;
        font-size: 1rem;
        @media (min-width: 640px) {
            display: inline-block;
        }
        &.admin-link {
            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    color: var(--main-text-color);
                    transition: color var(--transition);
                }
            }
        }
    }
    .user-menu-group {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .toggle-user-menu {
        display: flex;
        height: 100%;
        align-items: center;
        text-transform: none;
        user-select: none;
        background: none;
        color: var(--faded-text-color);

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                color: var(--main-text-color);
                transition: color var(--transition);
            }
        }

        .activated {
            color: var(--main-text-color);
        }
        .user-menu-item {
            display: flex;
            align-items: center;
            color: inherit;
            width: var(--icon-size);
            height: 100%;
            transition: transform var(--transition);
            .user-menu-avatar {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }

    .user-menu-dropdown {
        display: flex;
        align-items: center;

        position: absolute;
        top: var(--header-height);
        right: -1rem;
        padding: 0 1rem;

        display: none;
        height: 4rem;
        box-shadow: var(--shadow-3);
        border-radius: 0 0 0.3rem 0.5rem;
        background-color: var(--header-bg-color);

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

        .user-menu-link {
            user-select: none;
        }
    }
`;
