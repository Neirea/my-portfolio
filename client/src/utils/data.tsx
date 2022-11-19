import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin";
import { FiMail } from "@react-icons/all-files/fi/FiMail";

export const socialMediaLinks = [
    {
        image: <FaGithub size={"100%"} />,
        name: "github",
        link: "https://github.com/Neirea",
    },
    {
        image: <FaLinkedin size={"100%"} />,
        name: "linkedin",
        link: "https://www.linkedin.com/in/eugene-shumilin/",
    },
    {
        image: <FiMail size={"100%"} />,
        name: "email",
        link: "mailto:neirea@ukr.net",
    },
];
export const menuItems = [
    { name: "HOME", link: "/" },
    { name: "BLOG", link: "/blog" },
    { name: "PROJECTS", link: "/project" },
    { name: "CONTACT", link: "/contact" },
];
export const recaptchaKey = process.env.REACT_APP_RECAPTCHA_CLIENT!; //personal recaptcha sit key
