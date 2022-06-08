import { useState, useRef, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const useLocalState = () => {
	const [alert, setAlert] = useState({
		show: false,
		text: "",
		type: "danger",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const reCaptchaRef = useRef<ReCAPTCHA>(null);

	const showAlert = useCallback(
		({ text, type = "danger" }: { text: string; type?: string }) => {
			setAlert({ show: true, text, type });
		},
		[setAlert]
	);
	const hideAlert = useCallback(() => {
		setAlert({ show: false, text: "", type: "danger" });
	}, [setAlert]);
	return {
		alert,
		showAlert,
		loading,
		setLoading,
		success,
		setSuccess,
		hideAlert,
		reCaptchaRef,
	};
};

export default useLocalState;
