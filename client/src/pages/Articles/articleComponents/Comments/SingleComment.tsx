import type { FormEvent, ChangeEvent } from "react";
import { SingleCommentContainer } from "./CommentStyles";
import { AlertMsg } from "../../../../styles/StyledComponents";
import { useGlobalContext } from "../../../../store/AppContext";
import EditComment from "./EditComment";
import ToolBar from "./CommentToolBar";
import CommentForm from "./CommentForm";
import { handleDate } from "../../../../utils/handleDate";
import type { IJsxComment } from "../../../../types/articleTypes";
import { userRoles } from "../../../../types/appTypes";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";

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

	const { level, comment } = commentElement;
	const step = 3; // % of marginLeft and cut on width
	const depth = level >= 5 ? 5 : level; //max depth to show
	const { commentsQuery, commentState, commentError } = useCommentsContext();

	/* show conditions */
	const isShowToolBar =
		commentState.type !== "edit" &&
		user &&
		user.isBanned === false &&
		(user._id === comment.user.id || user.roles.includes(userRoles.admin));

	const isDeepComment = level > 5 && comment.parentId && commentsQuery.data;

	const isShowMessage =
		commentState.type !== "edit" || commentState.id !== comment._id;

	const isShowSingleCommentAlert =
		commentError.msg && index === commentError.index;

	const isShowEditUI =
		user && commentState.type === "edit" && commentState.id === comment._id;

	const isShowReplyForm =
		user &&
		user.isBanned === false &&
		commentState.type === "reply" &&
		commentState.id === comment._id;

	return (
		<>
			{/* {isShowSingleCommentAlert && <AlertMsg>{commentError.msg}</AlertMsg>} */}
			<SingleCommentContainer step={step} depth={depth}>
				{/* Label above message */}
				<div id={`message-${index}`} className="reply-to">
					{isDeepComment && (
						<>
							{"to: "}
							<span className="comment-author">
								{commentsQuery.data[index - 1].comment.user.name}
							</span>
							{" from: "}
						</>
					)}
					<span className="comment-author">{comment.user.name}</span>
					<span className="comment-date">
						&nbsp;&nbsp;·&nbsp;&nbsp;
						{handleDate(comment.createdAt, comment.editedAt)}
					</span>
				</div>
				{/* Message */}
				{isShowMessage && (
					<p className="comment-message">
						{comment.message || <i>Message was deleted</i>}
					</p>
				)}
				{/* Single Comment Errors */}
				{isShowSingleCommentAlert && <AlertMsg>{commentError.msg}</AlertMsg>}
				{/* Edit Comment Form && Buttons */}
				{isShowEditUI && (
					<EditComment
						index={index}
						comment={comment}
						handleChange={handleChange}
					/>
				)}
				{/* Toolbar for comment */}
				{isShowToolBar && <ToolBar index={index} comment={comment} />}
			</SingleCommentContainer>
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
