import { ChangeEvent, FormEvent, Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CommentsWrapper, ReplyFormWrapper } from "./CommentStyles";
import { ReadButton, AlertMsg } from "../../../../styles/StyledComponents";

import SingleComment from "./SingleComment";

import { useGlobalContext } from "../../../../store/AppContext";
import { ACTIONS } from "../../../../types/articleTypes";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useCreateComment from "../../../../hooks/Articles/comments/useCreateComment";

const Comments = () => {
	const location = useLocation();

	const { user } = useGlobalContext();
	const { commentsQuery, commentState, setCommentState, commentError } =
		useCommentsContext();
	const { mutate: createComment, isLoading } = useCreateComment();

	const isShowCommentsHeader = !!commentsQuery.data?.length || user;
	const isShowCommentError =
		commentError.msg && commentError.index === undefined;
	const isShowNewCommentForm =
		user && user.isBanned === false && commentState.type === ACTIONS.none;

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setCommentState({ ...commentState, message: e.target.value });
	};

	const handleSubmit = async (e: FormEvent, index?: number) => {
		e.preventDefault();

		const submitData = {
			userId: user!._id,
			message: commentState.message,
			parentId: commentState.id,
		};

		createComment({ submitData, index });
	};

	return (
		<CommentsWrapper>
			<>
				{/* Comments Header */}
				{isShowCommentsHeader && (
					<h5>
						{commentsQuery.data
							? `Comments(${commentsQuery.data.length}):`
							: "Loading comments..."}
					</h5>
				)}
				{user && user.isBanned && (
					<AlertMsg>You are currently suspended from posting comments</AlertMsg>
				)}
				{/* mapping through comments */}
				{commentsQuery.data?.map((element, index) => {
					return (
						<Fragment key={index}>
							<SingleComment
								index={index}
								commentElement={element}
								handleChange={handleChange}
								handleSubmit={handleSubmit}
							/>
						</Fragment>
					);
				})}
			</>
			{
				/* alert for "Create New Comment" */
				isShowCommentError && <AlertMsg>{commentError.msg}</AlertMsg>
			}
			{/*show "Create New Comment" only if "Reply Form" and "Edit Message" are disabled */}
			{isShowNewCommentForm && (
				<ReplyFormWrapper onSubmit={handleSubmit}>
					<textarea
						id="new-comment"
						placeholder="Post New Comment"
						maxLength={280}
						minLength={10}
						className="create-comment"
						required={true}
						value={commentState.message}
						onChange={handleChange}
					></textarea>
					<ReadButton type="submit" disabled={isLoading}>
						Submit
					</ReadButton>
				</ReplyFormWrapper>
			)}
			{!user && (
				<>
					<div className="notsigned-message">
						<span>
							<NavLink
								to="/login"
								style={{ color: "var(--button-color" }}
								state={{ from: location }}
								replace
							>
								{"Sign in "}
							</NavLink>
						</span>
						<span>{"to post a comment"}</span>
					</div>
				</>
			)}
		</CommentsWrapper>
	);
};

export default Comments;
