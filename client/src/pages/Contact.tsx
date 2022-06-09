import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../utils/data";
import {
	BlockButton,
	AlertMsg,
	AlertContainer,
	StyledForm,
} from "../styles/StyledComponents";

import FormRow from "../components/FormRow";
import useLocalState from "../utils/useLocalState";
import { useGlobalContext } from "../store/AppContext";

const Contact = () => {
	const navigate = useNavigate();
	const { user } = useGlobalContext();
	const { alert, showAlert, loading, setLoading, hideAlert, reCaptchaRef } =
		useLocalState();

	const [values, setValues] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [timeLeft, setTimeLeft] = useState(-1);

	//auto-fill form hen user logged in
	useEffect(() => {
		if (!user) return;

		if (user) {
			setValues({
				name: user.name,
				email: "",
				message: "",
			});
		}
	}, [user]);

	//timer after which it goes to Home page
	useEffect(() => {
		if (timeLeft === -1) return;
		if (timeLeft === 0) {
			navigate("/");
		} else {
			const timer1 = setTimeout(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);
			return () => clearTimeout(timer1);
		}
	}, [timeLeft, navigate]);

	const handleChange = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e: FormEvent) => {
		if (!reCaptchaRef.current) return;
		e.preventDefault();
		hideAlert();
		setLoading(true);

		const { name, email, message } = values;
		const contactMessage = {
			subject: `${name} from ${email}`,
			msg: message,
		};

		try {
			// const token = await reCaptchaRef.current.getValue(); //recaptcha token for "i am not a robot"
			const token = await reCaptchaRef.current.executeAsync();
			reCaptchaRef.current.reset();

			await axios.post("/api/action/testCaptcha", {
				token,
			});
			await axios.post("/api/action/sendContactMessage", contactMessage);
			setValues({ name: "", email: "", message: "" });
			showAlert({
				text: `contact message was successfully sent!`,
				type: "success",
			});
			setTimeLeft(5);
		} catch (error) {
			const alertText = axios.isAxiosError(error)
				? (error?.response?.data as any).msg
				: "There was an error!";
			showAlert({ text: alertText });
		} finally {
			setLoading(false);
		}
	};
	return (
		<main>
			{alert.show ? (
				<AlertContainer>
					<p>{alert.text}</p>
					<Link to="/">
						{timeLeft >= 0
							? `Redirecting back to Home page in ${timeLeft}...`
							: "Go back to Home page"}
					</Link>
				</AlertContainer>
			) : (
				<StyledForm onSubmit={onSubmit}>
					<FormRow
						focus={true}
						type="name"
						name="name"
						label="your name"
						value={values.name}
						handleChange={handleChange}
						isRequired={true}
						title="Name must be letters (optionally followed by numbers)"
						pattern="[a-zA-Z]+[0-9]*"
					/>
					<FormRow
						type="email"
						name="email"
						label="your contact email"
						value={values.email}
						handleChange={handleChange}
					/>
					<FormRow
						type="text"
						name="message"
						label="your message"
						value={values.message}
						handleChange={handleChange}
					/>
					<ReCAPTCHA
						className="recaptcha"
						sitekey={recaptchaKey}
						size="invisible"
						ref={reCaptchaRef}
					/>
					{alert.show && <AlertMsg>{alert.text}</AlertMsg>}
					<BlockButton type="submit" disabled={loading}>
						{loading ? "Loading..." : "Send"}
					</BlockButton>
					<address>
						<b>Email:</b> neireawar@gmail.com
					</address>
				</StyledForm>
			)}
		</main>
	);
};

export default Contact;
