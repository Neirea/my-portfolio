import { StyledLoading } from "../styles/StyledComponents";
import { useGlobalContext } from "../store/AppContext";

const LoadingSpinner = () => {
	const { darkMode } = useGlobalContext();

	return (
		<StyledLoading as="div" darkMode={darkMode}>
			<div />
		</StyledLoading>
	);
};

export default LoadingSpinner;
