import styled from "styled-components";

export const HomePageWrapper = styled.main`
    display: flex;
    flex-direction: column;
    padding: 0 5%;
    .home-top {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        position: relative;
        gap: 2rem;
        padding: 15% 0;
        min-height: calc(100vh - var(--header-height) + 1px);

        @media (min-width: 1000px) {
            flex-direction: row;
            justify-content: space-evenly;
        }

        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-bottom: 1px solid var(--tag-color);
        }
    }
`;

export const HomeEditor = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 0 1rem 0 var(--header-shadow-color);

    @media (min-width: 1000px) {
        min-width: 30rem;
    }

    .home-editor-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 1rem;
        background: var(--article-bg-color);
        border-bottom: 1px solid var(--tag-color);
        height: var(--icon-size);
        .red-circle,
        .yellow-circle,
        .green-circle {
            width: calc(var(--icon-size) * 0.5);
            border-radius: 50%;
            height: 50%;
        }
        .red-circle {
            background: rgb(245, 101, 101);
        }
        .yellow-circle {
            background: rgb(236, 201, 75);
        }
        .green-circle {
            background: rgb(72, 187, 120);
        }
    }
    .home-editor-body {
        display: flex;
        width: 100%;
        background: var(--code-bg-color);
        font-size: 1.1rem;

        .home-editor-numbers {
            padding: 1rem;
            border-right: 1px solid var(--tag-color);
        }
        .home-editor-code {
            padding: 1rem;
        }
        @media (min-width: 1000px) {
            font-size: 1.2rem;
        }
    }
`;

export const HomeIntroText = styled.div`
    .home-top-title {
        display: flex;
        flex-wrap: wrap;
        font-weight: 800;
        line-height: 1.2;
        &,
        & span {
            font-size: 4rem;
        }
        letter-spacing: var(--letter-spacing);
        color: var(--button-color);
        cursor: default;
    }
    .home-top-text,
    .home-bottom-text {
        color: var(--faded-text-color);
        width: fit-content;
        font-size: 1.5rem;
        font-weight: 500;
        font-family: Arial, sans-serif;
    }
    .home-top-text {
        line-height: 1;
    }
    .home-top-links {
        display: flex;
        gap: 1rem;
        height: var(--icon-size);
        a {
            width: var(--icon-size);
            color: var(--comment-header-color);
            opacity: 0.7;
            @media (hover: hover) and (pointer: fine) {
                &:hover,
                &:focus {
                    opacity: 1;
                    color: var(--button-color);
                }
            }
        }
    }
`;

export const TitleHighlight = styled.span<{ $item: number }>`
    display: inline-block;
    animation: wave 0.5s;
    animation-timing-function: ease-in-out;
    animation-delay: ${(props) => 0.3 + 0.05 * props.$item}s;
    transition: transform var(--transition);

    &:hover {
        transform: translateY(-0.5rem);
        color: var(--comment-header-color);
    }
    @keyframes wave {
        0% {
            color: var(--button-color);
            transform: translateY(0);
        }
        50% {
            color: var(--comment-header-color);
            transform: translateY(-0.5rem);
        }
        100% {
            color: var(--button-color);
            transform: translateY(0);
        }
    }
`;

export const HomeProjects = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 2 * var(--header-height));
    .projects-title {
        font-size: 2.5rem;
        padding: 1.5rem 0;
        text-align: center;
    }
    .projects-wrapper {
        display: grid;
        justify-content: center;
        position: relative;
        gap: 1rem;
        width: 100%;
        grid-template-columns: repeat(
            auto-fill,
            minmax(var(--article-card-width), 1fr)
        );
    }
    .more-btn {
        position: relative;
        margin: 3rem 0;
        border-radius: 10rem;
        background: none;
        color: var(--main-text-color);
        border: 2px solid var(--button-color);
        @media (hover: hover) and (pointer: fine) {
            &:hover,
            &:focus {
                color: var(--button-color);
            }
        }
    }
`;

export const FooterWrapper = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: var(--header-height);
    border-top: 1px solid var(--tag-color);
    margin: 0 auto;
    .footer-name {
        display: flex;
        align-items: center;
        color: var(--faded-text-color);
        font-weight: 500;
    }
`;
