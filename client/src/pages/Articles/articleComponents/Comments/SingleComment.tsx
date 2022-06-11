import { FormEvent, ChangeEvent, MouseEvent } from "react";
import { SingleCommentContainer, ReplyButton } from "./CommentStyles";
import { AlertMsg } from "../../../../styles/StyledComponents";
import { BsReplyFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { useGlobalContext } from "../../../../store/AppContext";
import { useArticleContext } from "../../../../store/SingleArticleContext";
import EditComment from "./EditComment";
import ToolBar from "./CommentToolBar";
import CommentForm from "./CommentForm";
import { handleDate } from "../../../../utils/handleDate";
import { useEffect } from "react";
import { ACTIONS, IJsxComment } from "../../../../types/articleTypes";
import { userRoles } from "../../../../types/appTypes";

interface SingleCommentProps {
	index: number;
	commentElement: IJsxComment;
	handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	handleSubmit: (e: FormEvent, index?: number) => void;
}

const SingleComment = ({
	index,
	commentElement,
	handleChange,
	handleSubmit,
}: SingleCommentProps) => {
	const { user } = useGlobalContext();

	const { alert, commentState, setCommentState, comments } =
		useArticleContext();
	const { level, comment } = commentElement;
	const step = 3; // % of marginLeft and cut on width
	const depth = level >= 5 ? 5 : level; //max depth to show

	/* show conditions */
	const isShowToolBar =
		commentState.type !== ACTIONS.edit &&
		user &&
		user.isBanned === false &&
		(user._id === comment.user.id || user.roles.includes(userRoles.admin));

	const isDeepComment = level > 5 && comment.parentId;
	const isShowMessage =
		commentState.type !== ACTIONS.edit || commentState.id !== comment._id;
	const isShowSingleCommentAlert =
		alert.show && index.toString() === alert.type;

	const isShowEditUI =
		user &&
		commentState.type === ACTIONS.edit &&
		commentState.id === comment._id;
	const isShowReplyButton =
		user && commentState.type !== ACTIONS.edit && comment.message;

	const isShowReplyForm =
		user &&
		user.isBanned === false &&
		commentState.type === ACTIONS.reply &&
		commentState.id === comment._id;

	const handleReply = (e: MouseEvent<HTMLButtonElement>) => {
		//remove existing active style
		const element = document.querySelector(".btn-activated");
		element && element.classList.remove("btn-activated");
		//on Cancel click
		if (commentState.id === comment._id) {
			setCommentState({
				type: ACTIONS.none,
				id: null,
				message: "",
			});
		} else {
			//any tag -> closest("button")?
			(e.target as HTMLButtonElement)?.classList.add("btn-activated");

			setCommentState({
				type: ACTIONS.reply,
				id: comment._id,
				message: "",
			});
		}
	};

	useEffect(() => {
		if (commentState.type !== ACTIONS.reply) {
			const element = document.querySelector(".btn-activated");
			element && element.classList.remove("btn-activated");
		}
	}, [commentState]);

	return (
		<>
			<SingleCommentContainer step={step} depth={depth}>
				<label htmlFor={`message-${index}`} className="comment-header">
					{/* Label above message */}
					<div id={`message-${index}`} className="reply-to">
						{isDeepComment && (
							<>
								{"to: "}
								<span className="comment-author">
									{comments[index - 1].comment.user.name}
								</span>
								{" from: "}
							</>
						)}
						<span className="comment-author">{comment.user.name}</span>
						<span className="comment-date">
							&nbsp;&nbsp;·&nbsp;&nbsp;
							{handleDate(comment.createdAt.toString())}
						</span>
					</div>
					{/* Toolbar for comment */}
					{isShowToolBar && <ToolBar index={index} comment={comment} />}
				</label>
				{/* Message */}
				{isShowMessage && (
					<p className="comment-message">
						{comment.message || <i>Message was deleted</i>}
					</p>
				)}
				{/* Edit Comment Form && Buttons */}
				{isShowEditUI && (
					<EditComment
						index={index}
						comment={comment}
						handleChange={handleChange}
					/>
				)}
				{isShowReplyButton && (
					<ReplyButton
						data-testid={`reply-button-${index}`}
						onClick={handleReply}
					>
						{commentState.id === comment._id ? (
							<MdClose size={"100%"} />
						) : (
							<BsReplyFill size={"100%"} />
						)}
					</ReplyButton>
				)}
			</SingleCommentContainer>
			{isShowSingleCommentAlert && <AlertMsg>{alert.text}</AlertMsg>}
			{/* Reply Form */}
			{isShowReplyForm && (
				<CommentForm
					comment={comment}
					index={index}
					step={step}
					depth={depth}
					onSubmit={handleSubmit}
					handleChange={handleChange}
				/>
			)}
		</>
	);
};

export default SingleComment;
