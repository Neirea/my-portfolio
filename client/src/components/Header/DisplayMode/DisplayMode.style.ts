import { styled } from "styled-components";
import { MenuItem } from "../Header.style";

type DisplayModeWrapperProps = {
    $darkMode: boolean;
};

export const DisplayModeWrapper = styled(MenuItem)<DisplayModeWrapperProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
    height: 100%;
    text-transform: none;
    z-index: 1;

    @media (hover: hover) and (pointer: fine) {
        &:hover .darkmode-container .darkmode-indicator {
            box-shadow: inset 0 0 0.15rem var(--main-text-color);
        }
        &:hover .darkmode-container .darkmode-indicator > svg {
            filter: var(--icon-invert-hover);
            transition: filter var(--transition);
        }
    }

    .darkmode-container {
        position: relative;
        width: 4rem;
        height: 2rem;
        border-radius: 2rem;
        background-color: var(--main-bg-color);
        box-shadow: inset 0 2px 0.75rem rgba(0, 0, 0, 0.1),
            inset 0 2px 2px rgba(0, 0, 0, 0.1),
            inset 0 -1px 1px rgba(0, 0, 0, 0.1);

        .darkmode-indicator {
            position: absolute;
            top: 0;
            left: ${(props) => (props.$darkMode === true ? "50%" : "0")};
            width: 50%;
            height: 100%;
            background: linear-gradient(
                to bottom,
                var(--header-bg-color),
                var(--main-bg-color)
            );
            border-radius: 50%;
            transform: scale(0.8);
            transition: left var(--transition), color var(--transition);
            box-shadow: inset 0 0 0.15rem var(--faded-text-color);

            .darkmode-icon {
                transform: scale(0.7);
                filter: var(--icon-invert);
            }
        }
    }
`;
