import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../utils/data";

import useLocalState from "../utils/useLocalState";

const Login = () => {
	const { reCaptchaRef } = useLocalState();

	const handleLoginGithub = () => {
		window.open("http://localhost:5000/api/auth/login/github", "_self");
	};

	//check if user is logged in then redirect to main page
	return (
		<main>
			<button onClick={handleLoginGithub}>Sign in with Github</button>
			<ReCAPTCHA
				className="recaptcha"
				sitekey={recaptchaKey}
				size="invisible"
				ref={reCaptchaRef}
			/>
		</main>
	);
};

export default Login;
