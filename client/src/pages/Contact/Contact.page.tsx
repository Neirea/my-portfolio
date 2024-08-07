import axios, { AxiosError } from "axios";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import FormRow from "../../components/FormRow";
import SuccessModal from "../../components/SuccessModal";
import { useGlobalContext } from "../../store/AppContext";
import {
    AlertMsg,
    BlockButton,
    StyledForm,
} from "../../styles/styled-components";
import { socialMediaLinks } from "../../utils/data";
import { LinkGroup } from "./Contact.style";
import { useTitle } from "../../utils/useTitle";

const Contact = () => {
    const { user } = useGlobalContext();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [values, setValues] = useState({
        name: "",
        email: "",
        message: "",
    });
    useTitle("Contact");
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
            setError("recaptcha is not ready yet");
            return false;
        }
        const token = await executeRecaptcha("contactMessage");
        return token;
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await handleRecaptchaVeify();
            if (token === false) return;
            await axios.post("/api/action/testCaptcha", { token });

            const { name, email, message } = values;
            const contactMessage = {
                subject: `${name} from ${email}`,
                msg: message,
            };
            await axios.post("/api/action/sendContactMessage", contactMessage);

            setModalOpen(true);
            setValues({ ...values, message: "" });
            setError("");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error?.response?.data?.msg || "There was an error!");
            }
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <main>
            {modalOpen && <SuccessModal closeModal={closeModal} />}
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
                {error && <AlertMsg>{error}</AlertMsg>}
                <BlockButton type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Send"}
                </BlockButton>
                <LinkGroup>
                    {socialMediaLinks.map((item, index) => {
                        return (
                            <a
                                key={`link-${index}`}
                                className="address-link"
                                href={item.link}
                                aria-label={item.name}
                            >
                                {item.image}
                            </a>
                        );
                    })}
                </LinkGroup>
            </StyledForm>
        </main>
    );
};

export default Contact;
