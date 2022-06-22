export type ThemeType = typeof lightTheme;

export const mainBgDarkColor = "rgb(25, 25, 25)";
export const mainBgLightColor = "rgb(250, 255, 253)";

export const lightTheme = {
	mainBgColor: mainBgLightColor,
	mainTextColor: "rgba(0, 0, 0,0.87)",
	fadedTextColor: "rgb(0,0,0,0.54)",
	headerBgColor: "rgb(255, 255, 255)",
	articleBgColor: "rgb(255, 255, 255)",
	iconInvert: "invert(40%)",
	iconInvertHover: "none",
	replyBgColor: "rgb(255, 255, 255)",
	deletedColor: "rgb(120, 120, 120)",
	buttonColor: "rgb(115, 170, 40)",
	codeBgColor: "rgb(250, 250, 250)",
	codeBorderColor: "rgb(211, 211, 211)",
	tagColor: "rgba(0,0,0,0.2)",
	commentAuthorColor: "rgb(131, 88, 219)",
	/* code highlight */
	codeSubStr: "#2f3337",
	codeComment: "#656e77",
	codeKeyword: "#015692",
	codeAttr: "#803378",
	codeType: "#b75501",
	codeSelectorClass: "#015692",
	codeString: "#54790d",
	codeMeta: "#015692",
	codeTitle: "#b75501",
	codeBullet: "#535a60",
	codeMetaString: "#54790d",
	colorDeletion: "#c02d2e",
	codeAddition: "#2f6f44",
};

export const darkTheme: ThemeType = {
	mainBgColor: mainBgDarkColor,
	mainTextColor: "rgb(225, 225, 225)",
	fadedTextColor: "rgb(255,255,255,0.54)",
	headerBgColor: "rgb(33, 33, 33)",
	articleBgColor: "rgb(33, 33, 33)",
	iconInvert: "invert(54%)",
	iconInvertHover: "invert(100%)",
	replyBgColor: "rgb(33, 33, 33)",
	deletedColor: "rgb(155, 155, 155)",
	buttonColor: "rgb(140,200,65)",
	codeBgColor: "rgb(45, 45, 45)",
	codeBorderColor: "rgb(60, 60, 60)",
	tagColor: "rgba(255,255,255,0.2)",
	commentAuthorColor: "rgb(165, 138, 219)",
	/* code highlight */
	codeSubStr: "#fff",
	codeComment: "#999",
	codeKeyword: "#88aece",
	codeAttr: "#c59bc1",
	codeType: "#f08d49",
	codeSelectorClass: "#88aece",
	codeString: "#b5bd68",
	codeMeta: "#88aece",
	codeTitle: "#f08d49",
	codeBullet: "#ccc",
	codeMetaString: "#b5bd68",
	colorDeletion: "#de7176",
	codeAddition: "#76c490",
};
