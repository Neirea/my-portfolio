import axios from "axios";
import {
    type ChangeEvent,
    type FormEvent,
    type JSX,
    useEffect,
    useState,
} from "react";
import FormRow from "../../components/FormRow";
import SuccessModal from "../../components/SuccessModal";
import { useGlobalContext } from "../../store/AppContext";
import { AlertMsg, BlockButton, StyledForm } from "../../styles/common.style";
import { recaptchaKey, socialMediaLinks } from "../../utils/data";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { getRecaptchaToken } from "../../utils/recaptcha";
import { useTitle } from "../../utils/useTitle";
import { LinkGroup } from "./Contact.style";

const Contact = (): JSX.Element => {
    const { user } = useGlobalContext();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [values, setValues] = useState({
        name: "",
        email: "",
        message: "",
    });
    useTitle("Contact");

    useEffect(() => {
        const script = document.createElement("script");
        const scriptId = "recaptcha-script";
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${recaptchaKey}`;
        script.async = true;
        document.body.appendChild(script);
        return (): void => {
            const script = document.getElementById(scriptId);
            if (script) {
                script.remove();
            }
            const badge =
                document.querySelector(".grecaptcha-badge")?.parentElement;
            if (badge) {
                badge.remove();
            }
            delete window.grecaptcha;
        };
    }, []);

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
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ): void => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getRecaptchaToken("contact_email");
            if (token === "") {
                setError("Failed to verify reCAPTCHA");
                return;
            }
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
            const errorMessage = getErrorMessage(error, "There was an error");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = (): void => {
        setModalOpen(false);
    };

    return (
        <main>
            {modalOpen && <SuccessModal closeModal={closeModal} />}
            <StyledForm onSubmit={(e) => void handleSubmit(e)}>
                <FormRow
                    focus={true}
                    type="name"
                    name="name"
                    label="your name"
                    value={values.name}
                    handleChange={handleChange}
                    isRequired={true}
                    title="Must be names separated by spaces"
                    pattern="^([a-zA-Z\u0400-\u04FF\u0500-\u052F]+( [a-zA-Z\u0400-\u04FF\u0500-\u052F]+)*)"
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
