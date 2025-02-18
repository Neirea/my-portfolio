import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaGoogle } from "@react-icons/all-files/fa/FaGoogle";
import { useLocation } from "react-router-dom";
import { AlertMsg, LoginButton } from "../../styles/styled-components";
import type { LocationState } from "../../types/app.type";
import { useCurrentLocation } from "../../utils/useCurrentLocation";
import { LoginWrapper } from "./Login.style";

const Login = () => {
    const location = useLocation<LocationState>();
    const queries = useCurrentLocation();
    const errorQuery = queries.get("error");
    const fromLocation = location.state?.from;
    const fromUrl =
        fromLocation && fromLocation.pathname.length > 1
            ? fromLocation.pathname.slice(1) + fromLocation.search
            : "";

    const handleLoginGithub = async () => {
        window.open(
            `${
                import.meta.env.VITE_SERVER_URL
            }/api/auth/login/github?path=${fromUrl}`,
            "_self"
        );
    };

    const handleLoginGoogle = async () => {
        window.open(
            `${
                import.meta.env.VITE_SERVER_URL
            }/api/auth/login/google?path=${fromUrl}`,
            "_self"
        );
    };

    return (
        <LoginWrapper>
            <div className="login-container">
                <h4>Sign in with</h4>
                {errorQuery === "login_failed" && (
                    <AlertMsg>Login failed</AlertMsg>
                )}
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

export default Login;
