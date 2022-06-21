import { ReadButton } from "../../../../styles/StyledComponents";
import { CommentFormWrapper } from "./CommentStyles";
import type { IComment } from "../../../../types/articleTypes";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import useCreateComment from "../../../../hooks/Articles/comments/useCreateComment";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import { useGlobalContext } from "../../../../store/AppContext";

interface ReplyFormProps {
	comment?: IComment;
	index?: number;
	step?: number;
	depth?: number;
}

const ReplyForm = ({ comment, index, step, depth }: ReplyFormProps) => {
	const { user } = useGlobalContext();
	const { commentState } = useCommentsContext();
	const { mutate: createComment, isLoading, isSuccess } = useCreateComment();
	const [message, setMessage] = useState("");

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	};

	const handleSubmit = async (e: FormEvent, index?: number) => {
		e.preventDefault();

		const submitData = {
			userId: user!._id,
			message: message,
			parentId: commentState.id,
		};

		createComment({ submitData, index });
	};

	useEffect(() => {
		if (isSuccess) setMessage("");
	}, [isSuccess]);

	return (
		<CommentFormWrapper
			depth={depth}
			step={step}
			onSubmit={(e) => handleSubmit(e, index)}
		>
			{comment && (
				<label htmlFor={`reply-${index}`} className="reply-to">
					<span>{"reply to: "}</span>
					<span className="comment-author">{`${comment.user.name}`}</span>
				</label>
			)}
			<textarea
				id={comment ? `reply-${index}` : "new-comment"}
				maxLength={280}
				minLength={10}
				className="create-comment"
				placeholder={comment ? "" : "Post New Comment"}
				autoFocus={comment ? true : false}
				value={message}
				required={true}
				onChange={handleChange}
			></textarea>
			<ReadButton type="submit" disabled={isLoading}>
				{isLoading ? "Saving..." : "Submit"}
			</ReadButton>
		</CommentFormWrapper>
	);
};

export default ReplyForm;
