import { BsArrowDown } from "@react-icons/all-files/bs/BsArrowDown";
import hljs from "highlight.js/lib/common";
import useArticles from "../hooks/Articles/useArticles";
import { MoreButton } from "../styles/StyledComponents";
import { categoriesEnum } from "../types/articleTypes";
import { socialMediaLinks } from "../utils/data";
import ArticleCards from "./Articles/articleComponents/ArticleCards";
import {
	FooterWrapper,
	HomeArrow,
	HomeEditor,
	HomeIntroText,
	HomePageWrapper,
	HomeProjects,
	TitleHighlight,
} from "./HomeStyles";

const Home = () => {
	const { data } = useArticles(categoriesEnum.project);
	const projects = data
		?.sort((a, b) => (new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1))
		.slice(0, 4);

	const handleScroll = () => {
		const arrowElem = document.querySelector<HTMLButtonElement>("#home-arrow");
		if (arrowElem) {
			arrowElem.scrollIntoView({
				behavior: "smooth",
			});
			setTimeout(() => {
				arrowElem.style.display = "none";
			}, 500);
		}
	};

	const codeText =
		'const aboutMe = {\n\tspecialty: "web development",\n\tprinciple: "keep it simple",\n\tattributes: ["curious", "persistent",\n\t\t\t\t\t"competitive"]\n}';

	const formatCode = (text: string) => {
		return hljs.highlight(text, { language: "javascript" }).value;
	};

	return (
		<>
			<HomePageWrapper>
				<section className="home-top">
					<HomeIntroText>
						<p className="home-top-text">Hello, I'm</p>
						<h3 className="home-top-title">
							<div>
								<TitleHighlight item={1}>E</TitleHighlight>
								<TitleHighlight item={2}>u</TitleHighlight>
								<TitleHighlight item={3}>g</TitleHighlight>
								<TitleHighlight item={4}>e</TitleHighlight>
								<TitleHighlight item={5}>n</TitleHighlight>
								<TitleHighlight item={6}>e</TitleHighlight>
							</div>
							<span>&nbsp;</span>
							<div>
								<TitleHighlight item={7}>S</TitleHighlight>
								<TitleHighlight item={8}>h</TitleHighlight>
								<TitleHighlight item={9}>u</TitleHighlight>
								<TitleHighlight item={10}>m</TitleHighlight>
								<TitleHighlight item={11}>i</TitleHighlight>
								<TitleHighlight item={12}>l</TitleHighlight>
								<TitleHighlight item={13}>i</TitleHighlight>
								<TitleHighlight item={14}>n</TitleHighlight>
							</div>
						</h3>
						<p className="home-bottom-text">
							A Software Engineer with a passion to solve problems
						</p>
						<div className="home-top-links">
							{socialMediaLinks.map((item, index) => {
								return (
									<a
										key={`link-${index}`}
										className="address-link"
										href={item.link}
										rel="noreferrer"
										aria-label={item.name}
									>
										{item.image}
									</a>
								);
							})}
						</div>
					</HomeIntroText>
					<HomeEditor>
						<div className="home-editor-header">
							<div className="red-circle"></div>
							<div className="yellow-circle"></div>
							<div className="green-circle"></div>
						</div>
						<div className="home-editor-body">
							<div className="home-editor-numbers">
								<div>1</div>
								<div>2</div>
								<div>3</div>
								<div>4</div>
								<div>5</div>
								<div>6</div>
							</div>
							<pre
								className="home-editor-code"
								dangerouslySetInnerHTML={{ __html: formatCode(codeText) }}
							></pre>
						</div>
					</HomeEditor>
					<HomeArrow
						id="home-arrow"
						aria-label="scroll-to-projects"
						onClick={handleScroll}
					>
						<BsArrowDown size={"100%"} />
					</HomeArrow>
				</section>
				<HomeProjects>
					<h2 className="projects-title">PROJECTS</h2>
					{projects && (
						<div className="projects-wrapper">
							<ArticleCards
								type={categoriesEnum.project}
								articleCards={projects}
							/>
						</div>
					)}
					<MoreButton to="/project" className="more-btn">
						More projects
					</MoreButton>
				</HomeProjects>
			</HomePageWrapper>
			<FooterWrapper>
				<p className="footer-name">Eugene Shumilin 2022</p>
			</FooterWrapper>
		</>
	);
};

export default Home;
