import styled from "styled-components";
import { MoreButton } from "../styles/StyledComponents";
import ArticleCards from "./Articles/articleComponents/ArticleCards";
import useArticles from "../hooks/Articles/useArticles";
import { socialMediaLinks } from "../utils/data";
import { categoriesEnum } from "../types/articleTypes";

const Home = () => {
	const { data } = useArticles(categoriesEnum.project);
	const projects = data?.filter((elem, idx) => idx < 4);

	return (
		<>
			<HomePageWrapper>
				<section className="home-top">
					<h1 className="home-top-title">Eugene Shumilin</h1>
					<p className="home-top-text">
						A Software Developer who loves to solve problems
					</p>
				</section>
				<section className="home-projects">
					<h2 className="projects-title">RECENT WORK</h2>
					{projects && (
						<div className="projects-wrapper">
							<ArticleCards
								type={categoriesEnum.project}
								articleCards={projects}
							/>
						</div>
					)}
					<MoreButton to="/project">More projects</MoreButton>
				</section>
			</HomePageWrapper>
			<FooterWrapper>
				<div className="footer-links">
					{socialMediaLinks.map((item, index) => {
						return (
							<a
								key={`link-${index}`}
								className="address-link"
								href={item.link}
								aria-label={item.name}
							>
								{item.image}
							</a>
						);
					})}
					<p className="footer-name">2022 Eugene Shumilin</p>
				</div>
			</FooterWrapper>
		</>
	);
};
const FooterWrapper = styled.footer`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 80%;
	height: var(--header-height);
	border-top: 1px solid var(--tag-color);
	margin: 0 auto;
	.footer-links {
		display: flex;
		gap: 1rem;
		height: 1.5rem;
		color: var(--faded-text-color);

		a:hover {
			color: var(--button-color);
		}
		.footer-name {
			display: flex;
			align-items: center;
			color: var(--faded-text-color);
			font-weight: 500;
		}
	}
`;

const HomePageWrapper = styled.main`
	display: flex;
	flex-direction: column;
	.home-top {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		position: relative;
		gap: 0.5rem;
		padding: 0 10%;
		height: calc(100vh - var(--header-height));

		text-align: center;
		.home-top-title {
			display: flex;
			justify-content: center;
			font-size: 4rem;
			font-weight: 800;
			line-height: 1;
			letter-spacing: var(--letter-spacing);
		}
		.home-top-text {
			color: var(--faded-text-color);
			font-size: 1.5rem;
			font-weight: 500;
			font-family: Arial, sans-serif;
		}
		.home-top-links {
			display: flex;
			gap: 1rem;
			height: 2rem;
			a {
				color: var(--faded-text-color);
				&:hover {
					color: var(--main-text-color);
				}
			}
		}
	}
	.home-projects {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
		.projects-title {
			letter-spacing: -0.05rem;
			padding-bottom: 1rem;
			text-align: center;
		}
		.projects-wrapper {
			display: grid;
			position: relative;
			/* width: var(--article-card-width); */
			gap: 1rem;
			justify-content: center;
			width: 80%;
			/* @media (min-width: 768px) { */
			grid-template-columns: repeat(auto-fit, minmax(22rem, 0.75fr));
			/* grid-template-columns: repeat(auto-fit, calc(25% - 0.75rem)); */
			/* } */
		}
	}
`;

export default Home;
