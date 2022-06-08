import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { BlockButton, AlertMsg, StyledForm } from "../styles/StyledComponents";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../utils/data";

import useLocalState from "../utils/useLocalState";

const Login = () => {
	const location = useLocation();
	const fromUrl =
		(location.state as any)?.from?.pathname +
			(location.state as any)?.from?.search || "/";
	const { alert, showAlert, loading, setLoading, hideAlert, reCaptchaRef } =
		useLocalState();

	//check if user is logged in then redirect to main page
	return (
		<main>
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
