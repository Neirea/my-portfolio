import { AlertContainer, LinkButton } from "../styles/styled-components";

const Error = () => {
    return (
        <AlertContainer as="main">
            <b style={{ fontSize: "9rem" }}>404</b>
            <h3>Page not found</h3>
            <br />
            <LinkButton to="/">Back Home</LinkButton>
        </AlertContainer>
    );
};

export default Error;
