import { BsGithub, BsLinkedin } from "react-icons/bs";

export const socialMediaLinks = [
	{
		image: <BsLinkedin size={"100%"} />,
		name: "linkedin",
		link: "https://www.linkedin.com/in/yevhenii-shumilin-2ab431188/",
	},

	{
		image: <BsGithub size={"100%"} />,
		name: "github",
		link: "https://github.com/Neirea",
	},
];
export const menuItems = [
	{ name: "HOME", link: "/" },
	{ name: "BLOG", link: "/blog" },
	{ name: "PROJECTS", link: "/project" },
	{ name: "CONTACT", link: "/contact" },
	{ name: "RESUME", link: "https://twitter.com" }, // add link to google docs later
];

export const recaptchaKey = "6LejCXMeAAAAABLDiGtB9YN5PkQUItewsdZFUhtV"; //personal recaptcha key
