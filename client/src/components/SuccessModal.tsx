import { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { PortalModal, SuccessButton } from "../styles/common.style";
import { createModalWrapper } from "../utils/modalWrapper";

const SuccessModal = ({
    closeModal,
}: {
    closeModal: () => void;
}): JSX.Element => {
    const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();

    useLayoutEffect(() => {
        let modalRoot = document.getElementById("success-portal");
        if (!modalRoot) {
            modalRoot = createModalWrapper("success-portal");
        }

        setModalWrapper(modalRoot);
        return (): void => {
            modalRoot?.parentNode?.removeChild(modalRoot);
        };
    }, []);

    if (!modalWrapper) return <></>;

    return ReactDOM.createPortal(
        <PortalModal>
            <section className="success-container">
                <h4>Email was successfuly sent!</h4>
                <SuccessButton onClick={() => closeModal()}>
                    Continue
                </SuccessButton>
            </section>
        </PortalModal>,
        modalWrapper,
    );
};

export default SuccessModal;
