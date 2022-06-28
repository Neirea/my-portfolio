import hljs from "highlight.js/lib/common";
hljs.registerLanguage(
	"dockerfile",
	require("highlight.js/lib/languages/dockerfile")
);

//replace html symbols to real ones
function formatString(str: string) {
	return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function getChildrenElementsString(elements: HTMLCollection) {
	let result = "";
	for (let i = 0; i < elements.length; i++) {
		result += elements[i].outerHTML;
	}
	return result;
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
		const currentLang = languages.length > index ? languages[index] : null;
		const highlightedCodeString = codeElementWithNewLines
			? currentLang !== null
				? hljs.highlight(codeElementWithNewLines, { language: currentLang })
						.value
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
			languages.push(
				hljs.highlightAuto(codeElementWithNewLines).language || "plaintext"
			);
		}
	});
	div.remove();
	return languages;
};
