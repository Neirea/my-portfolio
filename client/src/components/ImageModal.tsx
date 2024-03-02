import { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { PortalModal } from "../styles/styled-components";
import createWrapperAndAppend from "../utils/modalWrapper";

const ImageModal = ({
    image,
    closeModal,
}: {
    image: HTMLImageElement;
    closeModal: () => void;
}) => {
    const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();

    useLayoutEffect(() => {
        let modalRoot = document.getElementById("image-portal");
        if (!modalRoot) {
            modalRoot = createWrapperAndAppend("image-portal");
        }

        setModalWrapper(modalRoot);
        return () => {
            modalRoot?.parentNode?.removeChild(modalRoot);
        };
    }, []);

    if (!modalWrapper) return null;

    return ReactDOM.createPortal(
        <PortalModal onClick={() => closeModal()}>
            <img className="image-modal" src={image.src} alt={image.alt} />
        </PortalModal>,
        modalWrapper
    );
};

export default ImageModal;
