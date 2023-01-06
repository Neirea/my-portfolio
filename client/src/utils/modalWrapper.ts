export default function (id: string) {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", id);
    document.body.appendChild(modalRoot);
    return modalRoot;
}
