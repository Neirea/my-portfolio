import { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { PortalModal, SuccessButton } from "../styles/StyledComponents";
import createWrapperAndAppend from "../utils/modalWrapper";

const SuccessModal = ({ closeModal }: { closeModal: () => void }) => {
    const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();

    useLayoutEffect(() => {
        let modalRoot = document.getElementById("success-portal");
        if (!modalRoot) {
            modalRoot = createWrapperAndAppend("success-portal");
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
                <SuccessButton onClick={() => closeModal()}>
                    Continue
                </SuccessButton>
            </section>
        </PortalModal>,
        modalWrapper
    );
};

export default SuccessModal;
