import styled from "styled-components";

interface StyledCommentsProps {
	step: number;
	depth: number;
}
interface ReplyFormProps {
	step?: number;
	depth?: number;
}

export const CommentsWrapper = styled.section`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	.create-comment {
		background-color: var(--reply-bg-color);
		color: var(--main-text-color);
		margin-top: 0.5rem;
		padding: 1rem;
		width: 100%;
		min-height: 8rem;
		resize: none;
		border-radius: var(--border-radius);
	}

	.notsigned-message {
		color: var(--main-text-color);
		margin-top: 1rem;
		text-align: center;
		font-size: 1.25rem;
		font-weight: 500;
	}
`;
export const ToolsButton = styled.button`
	position: relative;
	background: none;
	color: var(--faded-text-color);
	border: transparent;
	padding: 0;
	height: var(--tools-button-size);
	width: var(--tools-button-size);
	cursor: pointer;

	&:disabled {
		opacity: 1;
	}

	@media (hover: hover) and (pointer: fine) {
		&:hover,
		&:focus {
			color: var(--main-text-color);
			transition: 0.3s;
		}
	}
`;
export const ReplyButton = styled(ToolsButton)`
	padding: 0;
	margin: 0;
	&::before {
		display: block;
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		transition: all var(--transition);
		background: none;
		opacity: 0.5;
		border-radius: 50%;
		transform: scale(0);
		box-shadow: 0px 0px 0px 1px var(--faded-text-color);
	}
	@media (hover: hover) and (pointer: fine) {
		&:hover::before {
			transform: scale(120%);
			box-shadow: 0px 0px 0px 1px var(--main-text-color);
		}
	}
`;

export const SingleCommentContainer = styled.div<StyledCommentsProps>`
	margin-left: ${(props) => props.depth * props.step || 0}%;
	padding: 0.5rem 1.5rem;
	width: ${(props) => 100 - props.depth * props.step || 100}%;
	height: auto;

	box-shadow: var(--shadow-1);
	border-radius: var(--border-radius);
	background-color: var(--article-bg-color);

	.reply-to {
		color: var(--comment-header-color);
		font-style: italic;
		.comment-author {
			font-weight: 500;
			font-style: normal;
			font-size: 0.9rem;
		}
		.comment-date {
			color: var(--faded-text-color);
			font-size: 0.75rem;
		}
	}

	.edit-comment-buttons {
		display: flex;
		gap: 0.5rem;

		justify-content: space-between;
	}
	.tool-bar {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		.tool-bar-group {
			display: flex;
			gap: 0.5rem;
		}
	}

	.btn-activated::before,
	.btn-activated:active::before {
		display: block;
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		transition: all var(--transition);
		background: none;
		opacity: 0.5;
		transform: scale(120%);
		box-shadow: 0px 0px 0px 1px var(--main-text-color);
	}

	.comment-message {
		margin: 0.5rem 0 1rem;
	}
`;

export const ReplyFormWrapper = styled.form<ReplyFormProps>`
	position: relative;
	margin-left: ${(props) =>
		(props.depth && props.step && props.depth * props.step) || 0}%;
	width: ${(props) =>
		(props.depth && props.step && 100 - props.depth * props.step) || 100}%;
`;
