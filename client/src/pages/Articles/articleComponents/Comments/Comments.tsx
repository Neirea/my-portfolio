import { ChangeEvent, FormEvent, Fragment } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { CommentsWrapper, ReplyFormWrapper } from "./CommentStyles";
import { ReadButton, AlertMsg } from "../../../../styles/StyledComponents";

import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../../../../utils/data";
import SingleComment from "./SingleComment";

import useLocalState from "../../../../utils/useLocalState";
import { useGlobalContext } from "../../../../store/AppContext";
import { useArticleContext } from "../../../../store/SingleArticleContext";
import { handleError } from "../../../../utils/handleError";
import { ACTIONS, IComment } from "../../../../types/articleTypes";

const Comments = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const { user } = useGlobalContext();
	const {
		alert,
		showAlert,
		hideAlert,
		loading,
		articleId,
		setLoading,
		comments,
		setComments,
		commentState,
		setCommentState,
	} = useArticleContext();
	const { reCaptchaRef } = useLocalState();

	const isShowCommentsHeader = comments?.length > 0 || user;
	const isShowLocalError = alert.show && alert.type === "-1";
	const isShowNewCommentForm =
		user && user.isBanned === false && commentState.type === ACTIONS.none;

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setCommentState({ ...commentState, message: e.target.value });
	};

	const updateCommentsAfterSubmit = (
		comment: IComment,
		index: number | undefined
	) => {
		if (index === undefined) return comments;
		const items = comments;
		if (commentState.type === ACTIONS.reply) {
			//fills replies array of parent with new comment
			items[index].comment.replies.push(comment);
			//adds comment into new position
			items.splice(index + 1, 0, {
				level: items[index].level + 1,
				comment: comment,
			});
		} else {
			//adds new comment at the end of array
			items.push({ level: 0, comment: comment });
		}
		return items;
	};

	const handleSubmit = async (e: FormEvent, index?: number) => {
		if (!reCaptchaRef.current) return;
		e.preventDefault();
		hideAlert();
		setLoading(true);

		try {
			if (!user) throw new Error("There was an error");

			// const token = await reCaptchaRef.current.getValue(); //recaptcha token for "i am not a robot"
			const token = await reCaptchaRef.current.executeAsync();
			reCaptchaRef.current.reset();

			await axios.post("/api/v1/action/testCaptcha", {
				token,
			});

			const submitData = {
				user: user._id,
				message: commentState.message,
				parent: commentState.id,
			};
			const { data } = await axios.post(
				`/api/v1/comment/${articleId}`,
				submitData
			);
			/* update local state of comments */
			const newComments = updateCommentsAfterSubmit(data.comment, index);
			setComments(newComments);
			setCommentState({
				type: ACTIONS.none,
				id: null,
				message: "",
			});
		} catch (error) {
			handleError(error, navigate);
			showAlert({
				text: error?.response?.data?.msg || "There was an error!",
				type: index !== undefined ? index.toString() : "danger",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<CommentsWrapper>
			<>
				{/* Comments Header */}
				{isShowCommentsHeader && (
					<h5>
						{comments
							? `Comments(${comments?.length}):`
							: "Loading comments..."}
					</h5>
				)}
				{user && user.isBanned && (
					<AlertMsg>You are currently suspended from posting comments</AlertMsg>
				)}
				{/* mapping through comments */}
				{comments &&
					comments.map((element, index) => {
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
			<ReCAPTCHA
				className="recaptcha"
				sitekey={recaptchaKey}
				size="invisible"
				ref={reCaptchaRef}
			/>
			{
				/* alert for "Create New Comment" */
				isShowLocalError && <AlertMsg>{alert.text}</AlertMsg>
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
					<ReadButton type="submit" disabled={loading}>
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
