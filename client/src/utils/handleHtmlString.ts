import hljs from "./hljsLangs";

//replace html symbols to real ones
function formatString(str: string) {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

export const handleHtmlString = (
    articleContent: string,
    languages: string[]
) => {
    //wrapping whole thing in div
    const div = document.createElement("div");

    div.innerHTML = articleContent;
    //looking for code element
    let codeElements = div.querySelectorAll("pre");
    //quit if no code elements found
    if (!codeElements.length) return articleContent;

    //loop through all <pre> element
    codeElements.forEach((elem, index) => {
        const newCodeWrapper = document.createElement("pre");
        // swapping <br> with '/n'
        const regex = /<br[^>]*>/gi;
        let codeElementWithNewLines = formatString(elem.innerHTML).replace(
            regex,
            "\n"
        );
        const codeInfo = getCodeInfo(codeElementWithNewLines);

        if (codeInfo?.code) {
            codeElementWithNewLines = codeInfo.code;
        }

        const currentLang =
            languages.length > index
                ? languages[index]
                : codeInfo?.language
                ? codeInfo?.language
                : null;
        const highlightedCodeString = codeElementWithNewLines
            ? currentLang !== null
                ? hljs.highlight(codeElementWithNewLines, {
                      language: currentLang,
                  }).value
                : hljs.highlightAuto(codeElementWithNewLines).value
            : "";
        newCodeWrapper.innerHTML = highlightedCodeString;

        //replace original code element with new one
        elem.parentNode?.replaceChild(newCodeWrapper, elem);
    });

    const resultString = getChildrenElementsString(div.children);
    div.remove();

    return resultString;
};

export const languageDetector = (htmlString: string) => {
    let languages: string[] = [];
    const div = document.createElement("div");

    div.innerHTML = htmlString;
    let codeElements = div.querySelectorAll("pre");

    codeElements.forEach((elem) => {
        // swapping <br> with '/n'
        const regex = /<br[^>]*>/gi;
        let codeElementWithNewLines = formatString(elem.innerHTML).replace(
            regex,
            "\n"
        );
        if (codeElementWithNewLines) {
            const codeInfo = getCodeInfo(codeElementWithNewLines);
            if (codeInfo?.language) {
                languages.push(codeInfo.language);
            } else {
                languages.push(
                    hljs.highlightAuto(codeElementWithNewLines).language ||
                        "plaintext"
                );
            }
        }
    });
    div.remove();
    return languages;
};

function getChildrenElementsString(elements: HTMLCollection) {
    let result = "";
    for (let i = 0; i < elements.length; i++) {
        result += elements[i].outerHTML;
    }
    return result;
}

function getCodeInfo(code: string) {
    let language = "";
    if (code.indexOf("~!") !== -1 && code.indexOf("!~") !== -1) {
        language = code.substring(code.indexOf("~!") + 2, code.indexOf("!~"));

        if (hljs.listLanguages().includes(language)) {
            return { language, code: code.split("!~")[1] };
        }
    }
    return undefined;
}
