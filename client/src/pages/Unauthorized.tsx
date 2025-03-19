import { useNavigate } from "react-router";
import { AlertContainer, ReadButton } from "../styles/common.style";

const Unauthorized = (): JSX.Element => {
    const navigate = useNavigate();
    const goBack = (): void => void navigate(-1);
    return (
        <AlertContainer as="main">
            <h2>Unauthorized</h2>
            <p>You do not have access to the requested page.</p>
            <br />
            <ReadButton onClick={goBack}>Go Back</ReadButton>
        </AlertContainer>
    );
};

export default Unauthorized;
