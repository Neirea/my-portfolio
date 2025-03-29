import hljs from "./hljsLangs";

//replace html character references to real characters
const formatString = (str: string): string => {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
};

const getChildrenElementsString = (elements: HTMLCollection): string => {
    let result = "";
    for (const elem of elements) {
        result += elem.outerHTML;
    }
    return result;
};

export const handleHtmlString = (articleContent: string): string => {
    const div = document.createElement("div");

    div.innerHTML = articleContent;
    const codeElements = div.querySelectorAll("code");
    if (!codeElements.length) return articleContent;

    codeElements.forEach((elem) => {
        const newCodeWrapper = document.createElement("code");

        const codeElementWithNewLines = formatString(elem.innerHTML);
        const language = elem.className.replace("language-", "") || "";

        const highlightedCodeString = hljs.listLanguages().includes(language)
            ? hljs.highlight(codeElementWithNewLines, { language }).value
            : hljs.highlightAuto(codeElementWithNewLines).value;
        newCodeWrapper.innerHTML = highlightedCodeString;

        elem.parentNode?.replaceChild(newCodeWrapper, elem);
    });

    const resultString = getChildrenElementsString(div.children);
    div.remove();

    return resultString;
};
