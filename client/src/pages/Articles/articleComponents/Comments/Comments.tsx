import { Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CommentsWrapper } from "./CommentStyles";
import { AlertMsg } from "../../../../styles/StyledComponents";
import CommentForm from "./CommentForm";

import SingleComment from "./SingleComment";

import { useGlobalContext } from "../../../../store/AppContext";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";

const Comments = () => {
	const location = useLocation();
	const { user } = useGlobalContext();
	const { commentsQuery, commentState, commentError } = useCommentsContext();

	const isShowCommentsHeader = !!commentsQuery.data?.length || user;
	const isShowCommentError =
		commentError.msg && commentError.index === undefined;
	const isShowNewCommentForm =
		user && user.isBanned === false && commentState.type === "none";

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
							<SingleComment index={index} commentElement={element} />
						</Fragment>
					);
				})}
			</>
			{
				/* alert for "Create New Comment" */
				isShowCommentError && <AlertMsg>{commentError.msg}</AlertMsg>
			}
			{/*show "Create New Comment" only if "Reply Form" and "Edit Message" are disabled */}
			{isShowNewCommentForm && <CommentForm />}
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
