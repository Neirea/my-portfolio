import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const buttonCSS = css`
    display: block;
    border-radius: var(--border-radius);
    background-color: var(--button-color);
    color: var(--main-bg-color);
    border: transparent;
    letter-spacing: var(--letter-spacing);
    text-transform: capitalize;
    text-align: center;
    font-size: 1rem;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    opacity: 1;

    @media (hover: hover) and (pointer: fine) {
        &:hover,
        &:focus {
            transition: 0.15s linear;
            opacity: 0.9;
        }
    }
`;
const ReadButtonCSS = css`
    ${buttonCSS}
    padding: 0.25rem 0.5rem;
    background-color: var(--article-bg-color);
    box-shadow: 0 0 0.2rem var(--faded-text-color);
    line-height: var(--line-height);
    font-weight: 550;
    color: var(--button-color);
    @media (hover: hover) and (pointer: fine) {
        &:hover,
        &:focus {
            opacity: 1;
            transition: all var(--transition);
            background-color: var(--button-color);
            color: var(--main-bg-color);
        }
    }
`;

/* Buttons */
export const ReadButton = styled.button`
    ${ReadButtonCSS}
`;

export const LinkButton = styled(Link)`
    ${ReadButtonCSS}
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
`;

export const SuccessButton = styled.button`
    ${buttonCSS}
    padding: 0.5rem 1rem;
`;
export const MoreButton = styled(Link)`
    ${buttonCSS}
    padding: 0.5rem 1rem;
`;

export const LoginButton = styled.button`
    ${buttonCSS}
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    padding: 1rem;
    width: 10rem;
    font-size: 1.1rem;
    transition: box-shadow var(--transition);

    @media (hover: hover) and (pointer: fine) {
        &:hover,
        &:focus {
            opacity: 1;
            box-shadow: 0 0 0.5rem 0rem var(--main-text-color);
        }
    }
`;

export const AdminButton = styled.button`
    ${buttonCSS}
    min-width: 5rem;
    padding: 0.5rem 1rem;
`;

export const AdminButtonLink = styled(Link)`
    ${buttonCSS}
    min-width: 5rem;
    padding: 0.5rem 1rem;
`;

export const BlockButton = styled.button`
    ${buttonCSS}
    margin: 1rem 0;
    height: 1.7rem;
    width: 100%;
`;

/* alerts */
export const AlertMsg = styled.p`
    margin: 0 auto;
    color: var(--alert-color);
    border-color: transparent;
    text-align: center;
    text-transform: capitalize;
`;

export const AlertContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5rem;
    color: var(--main-text-color);
    border-color: transparent;

    text-align: center;
    text-transform: capitalize;
    & > *:not(h1, h2, h3, h4, h5, h6) {
        font-size: 1.5rem;
    }
    & > .alert-link {
        display: inline-block;
        margin-left: 0.25rem;
        color: var(--button-color);
        text-transform: capitalize;
        opacity: 0.9;
        &:hover {
            opacity: 1;
        }
    }
`;

/* forms */
export const StyledForm = styled.form`
    position: relative;
    padding: 2rem 2.5rem;
    margin: 5rem auto 1rem;

    width: var(--form-width);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-1);
    background-color: var(--header-bg-color);
    & .form-row {
        margin-bottom: 1rem;
    }
    & .form-label {
        display: block;
        margin-bottom: 0.5rem;
        text-transform: capitalize;
        letter-spacing: var(--letter-spacing);
        font-weight: 500;
    }
    & .form-input, // for article create/edit check same ones
	& .form-textarea {
        display: block;
        width: 100%;
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--form-border-color);
        border-radius: var(--border-radius);
        background: var(--form-field-color);
    }
    & .form-message-input {
        padding: 0.375rem 0.75rem;
        height: 10rem;
        width: 100%;

        border-radius: var(--border-radius);
        border: 1px solid var(--form-border-color);
        background: var(--form-field-color);
        resize: vertical;
    }
`;

interface LoadingProps {
    darkMode: boolean;
}

/* spinning animation before page loads */
export const StyledLoading = styled.section<LoadingProps>`
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }
    display: flex;
    justify-content: center;
    align-items: center;

    & > div {
        width: 3rem;
        height: 3rem;
        text-indent: 0;
        border-radius: 50%;
        border: 0.3rem solid
            ${(props) =>
                props.darkMode === true
                    ? "rgb(255,255,255,0.1)"
                    : "rgb(0,0,0,0.1)"};

        margin: 0 auto;
        border-top: 0.3rem solid rgb(120, 180, 45);
        animation: spinner 1s linear infinite;
    }
`;

export const PortalModal = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 5;
    overflow: hidden;
    .success-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem 2rem;
        border-radius: var(--border-radius);
        background: var(--main-bg-color);
        z-index: 10;
    }
    .image-modal {
        width: min(80rem, 95%);
    }
`;
