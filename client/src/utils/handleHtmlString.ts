import hljs from "./hljsLangs";

//replace html character references to real characters
const formatString = (str: string): string => {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
};

export const handleHtmlString = (
    articleContent: string,
    languages: string[],
): string => {
    const div = document.createElement("div");

    div.innerHTML = articleContent;
    const codeElements = div.querySelectorAll("pre");
    if (!codeElements.length) return articleContent;

    codeElements.forEach((elem, index) => {
        const newCodeWrapper = document.createElement("pre");
        const regex = /<br[^>]*>/gi;
        let codeElementWithNewLines = formatString(elem.innerHTML).replace(
            regex,
            "\n",
        );
        const codeInfo = getCodeInfo(codeElementWithNewLines);

        if (codeInfo?.code) {
            codeElementWithNewLines = codeInfo.code;
        }

        const currentLang =
            languages.length > index ? languages[index] : codeInfo?.language;
        const highlightedCodeString = codeElementWithNewLines
            ? currentLang !== undefined
                ? hljs.highlight(codeElementWithNewLines, {
                      language: currentLang,
                  }).value
                : hljs.highlightAuto(codeElementWithNewLines).value
            : "";
        newCodeWrapper.innerHTML = highlightedCodeString;

        elem.parentNode?.replaceChild(newCodeWrapper, elem);
    });

    const resultString = getChildrenElementsString(div.children);
    div.remove();

    return resultString;
};

export const languageDetector = (htmlString: string): string[] => {
    const languages: string[] = [];
    const div = document.createElement("div");

    div.innerHTML = htmlString;
    const codeElements = div.querySelectorAll("pre");

    codeElements.forEach((elem) => {
        const regex = /<br[^>]*>/gi;
        const codeElementWithNewLines = formatString(elem.innerHTML).replace(
            regex,
            "\n",
        );
        if (codeElementWithNewLines) {
            const codeInfo = getCodeInfo(codeElementWithNewLines);
            if (codeInfo?.language) {
                languages.push(codeInfo.language);
            } else {
                languages.push(
                    hljs.highlightAuto(codeElementWithNewLines).language ||
                        "plaintext",
                );
            }
        }
    });
    div.remove();
    return languages;
};

const getChildrenElementsString = (elements: HTMLCollection): string => {
    let result = "";
    for (const elem of elements) {
        result += elem.outerHTML;
    }
    return result;
};

const getCodeInfo = (
    code: string,
): { language: string; code: string } | undefined => {
    let language = "";
    if (code.indexOf("~!") !== -1 && code.indexOf("!~") !== -1) {
        language = code.substring(code.indexOf("~!") + 2, code.indexOf("!~"));

        const actualCode = code.split("!~")[1] || "";
        if (hljs.listLanguages().includes(language)) {
            return { language, code: actualCode };
        }
    }
    return undefined;
};
