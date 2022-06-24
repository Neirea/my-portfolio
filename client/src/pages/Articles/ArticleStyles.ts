import styled from "styled-components";
import { StyledForm } from "../../styles/StyledComponents";

export const ArticlePageWrapper = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: 2rem 2.5%;
	gap: 1rem;

	.flex-item-1 {
		order: 2;
	}
	.flex-item-2 {
		order: 1;
	}
	.sidebar-single {
		display: none;
	}

	.create-article-button {
		position: fixed;
		bottom: 2rem;
		right: 2.5%;
		z-index: 1;
	}
	@media (min-width: 1000px) {
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		.flex-item-1 {
			order: 1;
		}
		.flex-item-2 {
			order: 2;
		}
		.sidebar-single {
			display: block;
		}
	}
	.article-aside-container {
		background: var(--article-bg-color);
		padding: 1rem;
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-1);
	}
	.article-alert-filter {
		width: var(--article-width);
	}
`;

export const ArticleContentWrapper = styled.section`
	width: var(--article-width);

	display: flex;
	position: relative;
	flex-direction: column;
	gap: 1rem;

	.article-post {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 5%;
		padding-bottom: 2rem;

		box-shadow: var(--shadow-1);
		border-radius: var(--border-radius);
		background-color: var(--article-bg-color);
		overflow-wrap: break-word;

		.article-header {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
			.article-title {
				text-align: center;
			}
			.article-image {
				display: block;
				width: 100%;
				aspect-ratio: 16/9;
				object-fit: cover;
				object-position: center;
			}
			.article-info {
				display: flex;
				width: 100%;
				justify-content: space-between;
				.article-date {
					color: var(--faded-text-color);
					font-size: 0.8rem;
				}
			}
		}
		//article text formatting
		.article-text {
			ul,
			ol {
				display: inline-block;
				padding-inline-start: 2rem;
			}
			ul {
				margin: 0.3rem 0;
				list-style: disc;
			}
			ol li {
				padding-left: 0.3rem;
			}
			pre,
			pre > * {
				font-size: 0.8rem;
			}
			pre {
				display: block;
				margin-block: 1.5rem;
				padding: 1rem;
				width: 100%;
				overflow-x: auto;

				background: var(--code-bg-color);
				border: 1px solid var(--code-border-color);
				border-radius: var(--border-radius);
			}
			p {
				min-height: var(--line-height);
			}
			iframe,
			img {
				margin: 1rem 0;
				width: 100%;
				aspect-ratio: 16/9;
				border: none;
			}
			a {
				text-decoration: underline;
			}
			blockquote {
				quotes: "«" "»";
				font-style: italic;
				margin: 1rem 0;
				padding: 0 1rem;
				border-left: 0.25rem solid var(--deleted-color);
				background: var(--code-bg-color);
				&::before {
					content: open-quote;
				}
				&::after {
					content: close-quote;
				}
			}
		}

		.article-links {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
		}
	}

	.admin-buttons {
		display: flex;
		flex-direction: row;
		justify-content: right;
		position: relative;
		gap: 1rem;
	}
`;

export const ArticleSideMenuWrapper = styled.aside`
	width: var(--article-width);
	.article-aside-title {
		color: var(--button-color);
		font-size: 1.2rem;
		@media (hover: hover) and (pointer: fine) {
			&:hover,
			&:focus {
				color: var(--main-text-color);
			}
		}
	}
	@media (max-width: 768px) {
		width: var(--article-card-width);
	}
	@media (min-width: 1000px) {
		width: 16rem;
		position: sticky;
		top: 6rem;
	}
`;

export const ArticleCardsWrapper = styled.section`
	display: grid;
	position: relative;
	width: var(--article-card-width);
	gap: 1rem;

	@media (min-width: 768px) {
		width: var(--article-width);
		grid-template-columns: repeat(auto-fit, calc(50% - 0.5rem));
	}
`;

export const ArticleCardContainer = styled.div`
	display: flex;
	flex-direction: column;

	box-shadow: var(--shadow-1);
	border-radius: var(--border-radius);
	background-color: var(--article-bg-color);
	overflow-wrap: break-word;
	overflow: hidden;
	transition: box-shadow 0.2s ease, transform 0.2s ease;

	&:hover {
		box-shadow: var(--shadow-1), 0 0 0.5rem var(--tag-color);
		transform: translateY(-2px);
	}

	.acard-image {
		display: block;
		width: 100%;
		object-fit: cover;
		object-position: center;
		aspect-ratio: 16/9;
	}

	.acard-content {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		.acard-title {
			@media (hover: hover) and (pointer: fine) {
				&:hover,
				&:focus {
					color: var(--button-color);
					transition: var(--transition);
				}
			}
		}

		.acard-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			column-gap: 0.5rem;
			.acard-tags-group {
				display: flex;
				column-gap: 0.3rem;
				flex-wrap: wrap;
				color: var(--faded-text-color);

				.acard-tag {
					font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
					font-size: 0.8rem;
				}
			}
			.acard-date {
				display: flex;
				justify-content: flex-end;
				min-width: 4rem;
				color: var(--faded-text-color);
				font-size: 0.8rem;
			}
		}

		.acard-text {
			margin-top: 0.2rem;
			display: -webkit-box;
			max-height: calc(3 * var(--main-line-height) * (var(--main-text-size)));

			text-overflow: ellipsis;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;

			overflow: hidden;
		}
		.acard-buttons {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
			margin-top: 0.5rem;
		}
	}
	.acard-admin-buttons {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		padding-top: 0;
		gap: 1rem;
	}
`;

export const TagsGroup = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-right: auto;

	& > button,
	& > a {
		display: block;
		height: 100%;
		padding: 0 0.25rem;
		background: none;
		border: 1px solid var(--tag-color);
		color: var(--faded-text-color);
		border-radius: var(--border-radius);
		font-size: 1rem;
		line-height: var(--line-height);
		text-transform: capitalize;
		user-select: none;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				border: 1px solid var(--main-text-color);
				color: var(--main-text-color);
			}
		}
		&.activated {
			outline: 1px solid var(--main-text-color);
			border: 1px solid var(--main-text-color);
			color: var(--main-text-color);
		}
	}
`;

//create/update article
export const CUArticleWrapper = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 0;
	padding: 2rem 2.5%;
	gap: 1rem;

	@media (min-width: 1000px) {
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
	}
`;

export const CUArticleForm = styled(StyledForm)`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 0 1rem 0;
	margin: 0;
	width: var(--article-width);

	.article-form-inputs {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 1rem;
		column-gap: 1rem;
		max-width: 90%;

		@media (min-width: 1000px) {
			flex-direction: row;
		}

		.form-row {
			text-align: center;
			.form-input {
				color: black;
			}
		}
	}

	.html-validator {
		opacity: 0;
		width: 0;
		height: 0;
	}

	//editor
	.editor-wrapper {
		margin-top: 0.5rem;
		width: 95%;
		color: black;
		z-index: 0;

		.editor-toolbar {
			margin-bottom: 0.25rem;
			background-color: var(--editor-color);
		}
		.editor-body {
			min-height: 30rem;
			padding: 0.5rem 2.5%;
			border-radius: var(--border-radius);
			border: 1px solid #f1f1f1;
			background-color: var(--editor-color);
		}
	}

	.public-DraftStyleDefault-block {
		margin: 0;
	}
	.rdw-fontfamily-wrapper,
	.rdw-block-wrapper {
		width: 7.25rem;
	}
`;
