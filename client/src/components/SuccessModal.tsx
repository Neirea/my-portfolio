import { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { PortalModal, SuccessButton } from "../styles/StyledComponents";

const createWrapperAndAppend = () => {
	const modalRoot = document.createElement("div");
	modalRoot.setAttribute("id", "success-portal");
	document.body.appendChild(modalRoot);
	return modalRoot;
};

const SuccessModal = ({ closeModal }: { closeModal: () => void }) => {
	const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();

	useLayoutEffect(() => {
		let modalRoot = document.getElementById("success-portal");
		if (!modalRoot) {
			modalRoot = createWrapperAndAppend();
		}

		setModalWrapper(modalRoot);
		return () => {
			modalRoot?.parentNode?.removeChild(modalRoot);
		};
	}, []);

	if (!modalWrapper) return null;

	return ReactDOM.createPortal(
		<PortalModal>
			<section className="success-container">
				<h4>Email was successfuly sent!</h4>
				<SuccessButton onClick={() => closeModal()}>Continue</SuccessButton>
			</section>
		</PortalModal>,
		modalWrapper
	);
};

export default SuccessModal;
