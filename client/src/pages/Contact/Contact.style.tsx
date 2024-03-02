import { styled } from "styled-components";

export const LinkGroup = styled.address`
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 0.5rem;

    .address-link {
        width: var(--icon-size);
        height: var(--icon-size);
        color: var(--comment-header-color);
        @media (hover: hover) and (pointer: fine) {
            &:hover,
            &:focus {
                color: var(--button-color);
            }
        }
    }
`;
