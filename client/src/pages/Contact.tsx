import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { BlockButton, AlertMsg, StyledForm } from "../styles/StyledComponents";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import FormRow from "../components/FormRow";
import useLocalState from "../utils/useLocalState";
import SuccessModal from "../components/SuccessModal";
import { useGlobalContext } from "../store/AppContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { socialMediaLinks } from "../utils/data";

const Contact = () => {
	const { user } = useGlobalContext();
	const { executeRecaptcha } = useGoogleReCaptcha();
	const { alert, showAlert, loading, setLoading, hideAlert } = useLocalState();

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

	const handleRecaptchaVeify = async () => {
		if (!executeRecaptcha) {
			showAlert({
				text: "recaptcha is not ready yet",
			});
			return;
		}
		const token = await executeRecaptcha("contactMessage");
		await axios.post("/api/action/testCaptcha", { token });
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		hideAlert();
		setLoading(true);

		const { name, email, message } = values;
		const contactMessage = {
			subject: `${name} from ${email}`,
			msg: message,
		};

		try {
			await handleRecaptchaVeify();
			await axios.post("/api/action/sendContactMessage", contactMessage);
			setValues({ ...values, message: "" });
			showAlert({
				text: "contact message was successfully sent!",
				type: "success",
			});
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
				{alert.show && alert.type !== "success" && (
					<AlertMsg>{alert.text}</AlertMsg>
				)}
				<BlockButton type="submit" disabled={loading}>
					{loading ? "Loading..." : "Send"}
				</BlockButton>
				<LinkGroup>
					<a className="address-link" href={socialMediaLinks[0].link}>
						<FaLinkedin size={"100%"} />
					</a>
					<a className="address-link" href={socialMediaLinks[1].link}>
						<FaGithub size={"100%"} />
					</a>
				</LinkGroup>
			</StyledForm>
		</main>
	);
};

const LinkGroup = styled.address`
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	margin-top: 2rem;

	.address-link {
		width: var(--icon-size);
		height: var(--icon-size);
		color: var(--faded-text-color);
		@media (hover: hover) and (pointer: fine) {
			&:hover,
			&:focus {
				color: var(--main-text-color);
			}
		}
	}
`;

export default Contact;
