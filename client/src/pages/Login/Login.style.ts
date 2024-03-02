import { styled } from "styled-components";

export const LoginWrapper = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;

    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        padding: 2rem 2.5rem;
        padding-top: 1rem;
        gap: 1rem;

        border-radius: var(--border-radius);
        box-shadow: var(--shadow-1);
        background-color: var(--header-bg-color);

        .btn-github {
            display: flex;
            align-items: center;
            background: rgb(25, 25, 25);
            color: white;
        }
        .btn-google {
            display: flex;
            align-items: center;
            background: #ff3434;
            color: white;
        }
    }
`;
