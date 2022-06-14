import { ReadButton } from "../../../../styles/StyledComponents";
import { ReplyFormWrapper } from "./CommentStyles";
import { IComment } from "../../../../types/articleTypes";
import { ChangeEvent, FormEvent } from "react";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";

interface ReplyFormProps {
	comment: IComment;
	index: number;
	step: number;
	depth: number;
	onSubmit: (e: FormEvent, index?: number) => void;
	handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const ReplyForm = ({
	comment,
	index,
	step,
	depth,
	onSubmit,
	handleChange,
}: ReplyFormProps) => {
	const { commentState } = useCommentsContext();

	return (
		<ReplyFormWrapper
			depth={depth}
			step={step}
			onSubmit={(e) => onSubmit(e, index)}
		>
			<label htmlFor={`reply-${index}`} className="reply-to">
				reply to:&nbsp;
				<span className="comment-author">{`${comment.user.name}`}</span>
			</label>
			<textarea
				id={`reply-${index}`}
				data-testid={`reply-box-${index}`}
				maxLength={280}
				minLength={10}
				className="create-comment"
				autoFocus
				value={commentState.message}
				required={true}
				onChange={handleChange}
			></textarea>
			<ReadButton type="submit">Submit</ReadButton>
		</ReplyFormWrapper>
	);
};

export default ReplyForm;
