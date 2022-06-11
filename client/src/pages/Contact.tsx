import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../utils/data";
import { BlockButton, AlertMsg, StyledForm } from "../styles/StyledComponents";

import FormRow from "../components/FormRow";
import useLocalState from "../utils/useLocalState";
import SuccessModal from "../components/SuccessModal";
import { useGlobalContext } from "../store/AppContext";

const Contact = () => {
	const { user } = useGlobalContext();
	const { alert, showAlert, loading, setLoading, hideAlert, reCaptchaRef } =
		useLocalState();

	const [values, setValues] = useState({
		name: "",
		email: "",
		message: "",
	});

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
			setValues({ ...values, message: "" });
			showAlert({
				text: `contact message was successfully sent!`,
				type: "success",
			});
			// setTimeLeft(5);
		} catch (error) {
			showAlert({ text: error?.response?.data?.msg || "There was an error!" });
		} finally {
			setLoading(false);
		}
	};
	return (
		<main>
			{alert.show && alert.type === "success" && (
				<SuccessModal alert={alert} hideAlert={hideAlert} />
			)}
			{/* <AlertContainer>
				<p>{alert.text}</p>
				<Link to="/">
					{timeLeft >= 0
						? `Redirecting back to Home page in ${timeLeft}...`
						: "Go back to Home page"}
				</Link>
			</AlertContainer> */}
			<StyledForm onSubmit={onSubmit}>
				<FormRow
					focus={true}
					type="name"
					name="name"
					label="your name"
					value={values.name}
					handleChange={handleChange}
					isRequired={true}
					title="Must be names separated by spaces"
					pattern="^([a-zA-Z]+( [a-zA-Z]+)*)"
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
				{alert.show && alert.type !== "success" && (
					<AlertMsg>{alert.text}</AlertMsg>
				)}
				<BlockButton type="submit" disabled={loading}>
					{loading ? "Loading..." : "Send"}
				</BlockButton>
				<address>
					<b>Email:</b> neireawar@gmail.com
				</address>
			</StyledForm>
		</main>
	);
};

export default Contact;
