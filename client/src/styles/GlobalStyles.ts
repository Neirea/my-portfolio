import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

*,*::before,*::after{
	padding:0;
	margin:0;
    box-sizing: border-box;
}
*::selection{
	background: ${({ theme }) => theme.buttonColor};
	color: ${({ theme }) => theme.mainBgColor};
}
:root{
	/* vars that are transformed for dark mode */
	--main-bg-color : ${({ theme }) => theme.mainBgColor};
	--main-text-color: ${({ theme }) => theme.mainTextColor};
	--header-bg-color: ${({ theme }) => theme.headerBgColor};
	--article-bg-color: ${({ theme }) => theme.articleBgColor};
	--code-bg-color: ${({ theme }) => theme.codeBgColor};
    --code-border-color: ${({ theme }) => theme.codeBorderColor};
	--reply-bg-color: ${({ theme }) => theme.replyBgColor};
	--deleted-color: ${({ theme }) => theme.deletedColor};
	--faded-text-color: ${({ theme }) => theme.fadedTextColor};
	--button-color: ${({ theme }) => theme.buttonColor};
	--icon-invert: ${({ theme }) => theme.iconInvert};
	--icon-invert-hover: ${({ theme }) => theme.iconInvertHover};
	--tag-color: ${({ theme }) => theme.tagColor};
	/* other vars */
	--header-shadow-color: rgba(0, 0, 0, 0.5);
	--editor-color: #fff;
	--form-field-color: #fff;
	--form-border-color: #94a3b8;
	--comment-header-color: mediumpurple;
	--alert-color: red;

	--form-width: min(30rem, 90vw);
	--icon-size: min(2rem, 10vw);
	--article-width: min(48rem,95%);
	--border-radius: 0.25rem;
	--tools-button-size: 1.25rem;
	--letter-spacing: 1px;
	--main-text-size: 1rem;
	--main-line-height: 1.7;

	--shadow-1: 0 0 0.2rem -1px var(--header-shadow-color);
	--shadow-2: -1px 1px 2px -1px var(--header-shadow-color);
	--shadow-3: 0 2px 4px -2px var(--header-shadow-color);

	--transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
	--header-transition: width 0.3s linear;
	--slider-transition: all 0.3s linear, color 0s;

}
//firefox
html{
	scrollbar-width: thin;
	scrollbar-color: var(--faded-text-color) var(--header-bg-color);
}
//others
html::-webkit-scrollbar{
	width: 0.5vw;
}
html::-webkit-scrollbar-thumb{
	border-radius:1rem;
	background-color: var(--faded-text-color);
}
html::-webkit-scrollbar-thumb:hover{
	background-color: var(--main-text-color);
}
html::-webkit-scrollbar-track{
	background-color: var(--header-bg-color);
}
//------------------------------------------------
body {  
	line-height: var(--main-line-height);
	color: var(--main-text-color);
	background: var(--main-bg-color);
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
	-webkit-font-smoothing: subpixel-antialiased;
	-moz-osx-font-smoothing: grayscale;
}
h1,
h2,
h3,
h4,
h5,
h6 {
	margin: 0;
	font-weight: 650;
	letter-spacing: var(--letterSpacing);
}
p {
	margin:0;
}

header > *{
	font-size: 1.2rem;
}
main > *{
	font-size: var(--main-text-size);
}
h1{
	font-size: 3rem;
}

h2{
	font-size: 2.5rem;
}

h3{
	font-size: 2rem;
}

h4{
	font-size: 1.5rem;
}

h5{
	font-size: 1.25rem;
}

h6{
	font-size: 1.125rem;
}
address {
	margin: 0;
	text-align: center;
	font-style: normal;
	font-size: 1.2rem;
	letter-spacing: var(--letter-spacing);
}
textarea,input{
	font-family: inherit;
	font-size:1rem;
}
code, pre {
	font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
		monospace;
}
a {
	color: inherit;
	text-decoration: none;
}
img{
	user-select: none;
}
ul {
	margin: 0;
	padding: 0;
	list-style: none;
}
//for deleted stuff
i{
	color:var(--deleted-color);
}
//for recaptcha elements
.recaptcha {
	position: fixed;
	top: 50%;
}

@media (max-width: 400px) {
	*{
		font-size:4vw;
	}
}

/* CODE HIGHLIGHT CLASSES */
.hljs-subst {
	color: ${({ theme }) => theme.codeSubStr};
}

.hljs-comment {
	color: ${({ theme }) => theme.codeComment};
}

.hljs-attr,
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-section,
.hljs-selector-tag {
	color: ${({ theme }) => theme.codeKeyword};
}

.hljs-attribute {
	color: ${({ theme }) => theme.codeAttr};
}

.hljs-name,
.hljs-number,
.hljs-quote,
.hljs-selector-id,
.hljs-template-tag,
.hljs-type {
	color: ${({ theme }) => theme.codeType};
}

.hljs-selector-class {
	color: ${({ theme }) => theme.codeSelectorClass};
}

.hljs-link,
.hljs-regexp,
.hljs-selector-attr,
.hljs-string,
.hljs-symbol,
.hljs-template-variable,
.hljs-variable {
	color: ${({ theme }) => theme.codeString};
}

.hljs-meta,
.hljs-selector-pseudo {
	color: ${({ theme }) => theme.codeMeta};
}

.hljs-built_in,
.hljs-literal,
.hljs-title {
	color: ${({ theme }) => theme.codeTitle};
}

.hljs-bullet,
.hljs-code {
	color: ${({ theme }) => theme.codeBullet};
}

.hljs-meta .hljs-string {
	color: ${({ theme }) => theme.codeMetaString};
}

.hljs-deletion {
	color: ${({ theme }) => theme.colorDeletion};
}

.hljs-addition {
	color: ${({ theme }) => theme.codeAddition};
}

.hljs-emphasis {
	font-style: italic
}

.hljs-strong {
	font-weight: 700
}
`;
