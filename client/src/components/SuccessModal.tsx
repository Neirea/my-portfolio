import ReactDOM from "react-dom";
import { Button, PortalModal } from "../styles/StyledComponents";

interface SuccessModalProps {
	alert: {
		show: boolean;
		text: string;
		type: string;
	};
	hideAlert: () => void;
}

const SuccessModal = ({ alert, hideAlert }: SuccessModalProps) => {
	if (!alert.show) return null;
	return ReactDOM.createPortal(
		<PortalModal>
			<section className="success-container">
				<h4>Email was successfuly sent!</h4>
				<Button className="success-button" onClick={() => hideAlert()}>
					Continue
				</Button>
			</section>
		</PortalModal>,
		document.getElementById("success-portal") as HTMLElement
	);
};

export default SuccessModal;
