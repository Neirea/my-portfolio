export const createModalWrapper = (id: string): HTMLDivElement => {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", id);
    document.body.appendChild(modalRoot);
    return modalRoot;
};
