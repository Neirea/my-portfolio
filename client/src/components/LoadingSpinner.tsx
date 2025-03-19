import { useGlobalContext } from "../store/AppContext";
import { StyledLoading } from "../styles/common.style";

const LoadingSpinner = (props: Partial<React.CSSProperties>): JSX.Element => {
    const { darkMode } = useGlobalContext();

    const { height, ...restProps } = props;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: height || "80vh",
                ...restProps,
            }}
        >
            <StyledLoading as="div" $darkMode={darkMode}>
                <div />
            </StyledLoading>
        </div>
    );
};

export default LoadingSpinner;
