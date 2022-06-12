import { useNavigate } from "react-router-dom";
import { ReadButton, AlertContainer } from "../styles/StyledComponents";

const Unauthorized = () => {
	const navigate = useNavigate();
	const goBack = () => navigate(-1);
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
