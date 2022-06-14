import styled from "styled-components";
// import useArticles from "../hooks/Articles/useArticles";

const Home = () => {
	// const projects = useArticles("project");

	// const { isLoading } = useQuery(
	// 	["project"],
	// 	() => {
	// 		const articlesCache = queryClient.getQueryData<{
	// 			articles: IArticle[];
	// 		}>("project");
	// 		if (articlesCache) return articlesCache;
	// 		axios
	// 			.get<{ articles: IArticle[] }>("/api/article/project")
	// 			.then((res) => res.data);
	// 	},
	// 	{ onSuccess: (data) => console.log("home=", data) }
	// );

	// console.log("cache=", queryClient.getQueryData("projects"));

	return (
		<HomePageWrapper>
			<section className="portfolio-info">
				<div className="portfolio-bio">
					<h4>Yevhenii Shumilin</h4>
					<article>
						<h5>Software Engineer & Game Developer</h5>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
					</article>
				</div>
				<div className="portfolio-skills">
					<h4>Experience</h4>
					<article>
						<h5>Software Engineer & Game Developer</h5>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
						<p>placeholder info</p>
					</article>
				</div>
			</section>
		</HomePageWrapper>
	);
};

const HomePageWrapper = styled.main`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	margin-top: 1rem;
	padding: 1rem;
	gap: 1rem;

	text-align: center;

	/* Text with info */
	.portfolio-info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		justify-items: center;
		justify-content: center;
		align-items: flex-start;

		gap: 1rem 2rem;
		width: 90%;
	}
	.portfolio-bio,
	.portfolio-skills {
		max-width: 30rem;
		padding: 0.1rem 1rem 1rem 1rem;

		box-shadow: var(--shadow-1);
		border-radius: var(--border-radius);
		background-color: var(--article-bg-color);
	}

	@media (min-width: 1000px) {
		flex-direction: row;
		align-items: flex-start;
		padding-top: 7rem;

		.portfolio-info {
			display: grid;
			width: 45%;
		}
	}
`;

export default Home;
