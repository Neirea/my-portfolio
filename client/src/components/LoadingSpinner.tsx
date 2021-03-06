import { useGlobalContext } from "../store/AppContext";
import { StyledLoading } from "../styles/StyledComponents";

const LoadingSpinner = () => {
	const { darkMode } = useGlobalContext();

	return (
		<StyledLoading as="div" darkMode={darkMode}>
			<div />
		</StyledLoading>
	);
};

export default LoadingSpinner;
