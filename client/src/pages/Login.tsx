import styled from "styled-components";
import axios from "axios";
import { LoginButton, AlertMsg } from "../styles/StyledComponents";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { LocationState } from "../types/appTypes";
import { useQuery } from "../utils/useQuery";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import useLocalState from "../utils/useLocalState";

const Login = () => {
	const location = useLocation<LocationState>();
	const query = useQuery();
	const { showAlert, hideAlert, alert } = useLocalState();
	const { executeRecaptcha } = useGoogleReCaptcha();
	const errorQuery = query.get("error");
	const fromLocation = location.state?.from;
	const fromUrl =
		fromLocation && fromLocation.pathname.length > 1
			? fromLocation.pathname.slice(1) + fromLocation.search
			: "";

	const handleRecaptchaVeify = async () => {
		if (!executeRecaptcha) {
			showAlert({
				text: "recaptcha is not ready yet",
			});
			return;
		}
		const token = await executeRecaptcha("login");
		await axios.post("/api/action/testCaptcha", { token });
	};

	const handleLoginGithub = async () => {
		hideAlert();
		try {
			await handleRecaptchaVeify();
			window.open(
				`http://localhost:5000/api/auth/login/github?path=${fromUrl}`,
				"_self"
			);
		} catch (error) {
			showAlert({ text: error?.response?.data?.msg || "There was an error!" });
		}
	};

	const handleLoginGoogle = async () => {
		hideAlert();
		try {
			await handleRecaptchaVeify();
			window.open(
				`http://localhost:5000/api/auth/login/google?path=${fromUrl}`,
				"_self"
			);
		} catch (error) {
			showAlert({ text: error?.response?.data?.msg || "There was an error!" });
		}
	};

	//check if user is logged in then redirect to main page
	return (
		<LoginWrapper>
			<div className="login-container">
				<h4>Sign in with</h4>
				{errorQuery === "login_failed" && <AlertMsg>Login failed</AlertMsg>}
				{alert.show && <AlertMsg>{alert.text}</AlertMsg>}
				<LoginButton className="btn-github" onClick={handleLoginGithub}>
					<FaGithub />
					<span>{"Github"}</span>
				</LoginButton>
				<LoginButton className="btn-google" onClick={handleLoginGoogle}>
					<FaGoogle />
					<span>{"Google"}</span>
				</LoginButton>
			</div>
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
