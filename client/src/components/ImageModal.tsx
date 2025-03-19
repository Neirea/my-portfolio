import { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { PortalModal } from "../styles/common.style";
import { createModalWrapper } from "../utils/modalWrapper";

const ImageModal = ({
    image,
    closeModal,
}: {
    image: HTMLImageElement;
    closeModal: () => void;
}): JSX.Element => {
    const [modalWrapper, setModalWrapper] = useState<HTMLElement | null>();

    useLayoutEffect(() => {
        let modalRoot = document.getElementById("image-portal");
        if (!modalRoot) {
            modalRoot = createModalWrapper("image-portal");
        }

        setModalWrapper(modalRoot);
        return (): void => {
            modalRoot?.parentNode?.removeChild(modalRoot);
        };
    }, []);

    if (!modalWrapper) return <></>;

    return ReactDOM.createPortal(
        <PortalModal onClick={() => closeModal()}>
            <img className="image-modal" src={image.src} alt={image.alt} />
        </PortalModal>,
        modalWrapper,
    );
};

export default ImageModal;
