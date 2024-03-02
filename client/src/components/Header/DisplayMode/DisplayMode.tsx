import { BsMoon } from "@react-icons/all-files/bs/BsMoon";
import { CgSun } from "@react-icons/all-files/cg/CgSun";
import { useGlobalContext } from "../../../store/AppContext";
import { DisplayModeWrapper } from "./DisplayMode.style";

const DisplayMode = () => {
    const { darkMode, toggleDarkMode } = useGlobalContext();
    return (
        <DisplayModeWrapper darkMode={darkMode}>
            <button
                className="darkmode-container"
                aria-label="dark-mode"
                onClick={toggleDarkMode}
            >
                <div className="darkmode-indicator">
                    {darkMode ? (
                        <BsMoon size={"100%"} className="darkmode-icon" />
                    ) : (
                        <CgSun size={"100%"} className="darkmode-icon" />
                    )}
                </div>
            </button>
        </DisplayModeWrapper>
    );
};

export default DisplayMode;
