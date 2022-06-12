import { useState, useCallback } from "react";

const useLocalState = () => {
	const [alert, setAlert] = useState({
		show: false,
		text: "",
		type: "danger",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

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
	};
};

export default useLocalState;
