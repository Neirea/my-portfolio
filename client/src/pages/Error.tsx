import { Link } from "react-router-dom";
import { AlertContainer, ReadButton } from "../styles/StyledComponents";

const Error = () => {
	return (
		<AlertContainer as="main">
			<b style={{ fontSize: "9rem" }}>404</b>
			<h3>Page not found</h3>
			<br />
			<Link to="/">
				<ReadButton>Back Home</ReadButton>
			</Link>
		</AlertContainer>
	);
};

export default Error;
