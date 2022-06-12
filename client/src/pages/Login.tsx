import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../utils/data";
import styled from "styled-components";
import useLocalState from "../utils/useLocalState";
import { LoginButton, AlertMsg } from "../styles/StyledComponents";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { LocationState } from "../types/appTypes";
import { useQuery } from "../utils/useQuery";

const Login = () => {
	const location = useLocation<LocationState>();
	const query = useQuery();
	const errorQuery = query.get("error");
	const fromLocation = location.state?.from;
	const fromUrl =
		fromLocation && fromLocation.pathname.length > 1
			? fromLocation.pathname.slice(1) + fromLocation.search
			: "";

	const { reCaptchaRef } = useLocalState();

	const handleLoginGithub = () => {
		window.open(
			`http://localhost:5000/api/auth/login/github?path=${fromUrl}`,
			"_self"
		);
	};

	const handleLoginGoogle = () => {
		window.open(
			`http://localhost:5000/api/auth/login/google?path=${fromUrl}`,
			"_self"
		);
	};

	//check if user is logged in then redirect to main page
	return (
		<LoginWrapper>
			<div className="login-container">
				<h4>Sign in with</h4>
				{errorQuery === "login_failed" && <AlertMsg>Login failed</AlertMsg>}
				<LoginButton className="btn-github" onClick={handleLoginGithub}>
					<FaGithub />
					<span>{"Github"}</span>
				</LoginButton>
				<LoginButton className="btn-google" onClick={handleLoginGoogle}>
					<FaGoogle />
					<span>{"Google"}</span>
				</LoginButton>
			</div>
			<ReCAPTCHA
				className="recaptcha"
				sitekey={recaptchaKey}
				size="invisible"
				ref={reCaptchaRef}
			/>
		</LoginWrapper>
	);
};

const LoginWrapper = styled.main`
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
			background: rgb(25, 25, 25);
			color: white;
		}
		.btn-google {
			background: #ff3434;
			color: white;
			border: none;
		}
	}
`;

export default Login;
