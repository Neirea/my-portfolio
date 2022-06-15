import ReactDOM from "react-dom";
import { SuccessButton, PortalModal } from "../styles/StyledComponents";

const SuccessModal = ({ closeModal }: { closeModal: () => void }) => {
	return ReactDOM.createPortal(
		<PortalModal>
			<section className="success-container">
				<h4>Email was successfuly sent!</h4>
				<SuccessButton onClick={() => closeModal()}>Continue</SuccessButton>
			</section>
		</PortalModal>,
		document.getElementById("success-portal") as HTMLElement
	);
};

export default SuccessModal;
