import { css, styled } from "styled-components";

const sharedStyle = css`
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-columns: repeat(5, 1fr);
    width: 80%;
`;

export const AdminDashboardWrapper = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 5rem;

    .users-title {
        ${sharedStyle}
        font-weight: 600;
    }
    .user-container {
        ${sharedStyle}

        height: 3rem;
        background: var(--article-bg-color);
        box-shadow: var(--shadow-1);
    }
    .user-image {
        width: 2rem;
        aspect-ratio: 1/1;
    }
    .user-ban-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    .user-ban {
        display: block;
        position: relative;
        width: 2rem;
        height: 2rem;

        color: var(--faded-text-color);
        &:hover {
            color: var(--main-text-color);
        }
    }
`;
