import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaGoogle } from "@react-icons/all-files/fa/FaGoogle";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { AlertMsg, LoginButton } from "../styles/StyledComponents";
import type { LocationState } from "../types/appTypes";
import { useCurrentLocation } from "../utils/useCurrentLocation";

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

    //check if user is logged in then redirect to main page
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

const LoginWrapper = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;

    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        padding: 2rem 2.5rem;
        padding-top: 1rem;
        gap: 1rem;

        border-radius: var(--border-radius);
        box-shadow: var(--shadow-1);
        background-color: var(--header-bg-color);

        .btn-github {
            display: flex;
            align-items: center;
            background: rgb(25, 25, 25);
            color: white;
        }
        .btn-google {
            display: flex;
            align-items: center;
            background: #ff3434;
            color: white;
        }
    }
`;

export default Login;
