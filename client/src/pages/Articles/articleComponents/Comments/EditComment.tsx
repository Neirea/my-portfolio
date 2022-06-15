import { ChangeEvent } from "react";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import { ReadButton } from "../../../../styles/StyledComponents";
import { IComment } from "../../../../types/articleTypes";
import useUpdateComment from "../../../../hooks/Articles/comments/useUpdateComment";

interface EditCommentProps {
	index: number;
	comment: IComment;
	handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditComment = ({ index, comment, handleChange }: EditCommentProps) => {
	const { commentState, resetCommentState } = useCommentsContext();
	const { mutate: updateComment, isLoading } = useUpdateComment();

	const handleSaveUpdate = async () => {
		updateComment({ commentId: comment._id, msg: commentState.message, index });
	};

	return (
		<>
			<textarea
				id={index.toString()}
				data-testid={`edit-box-${index}`}
				placeholder="Edit Message"
				maxLength={280}
				autoFocus
				onFocus={(e) => {
					//sets cursor at the end of input
					e.target.setSelectionRange(
						commentState.message.length,
						commentState.message.length
					);
				}}
				minLength={10}
				className="create-comment"
				value={commentState.message}
				required={true}
				onChange={handleChange}
			></textarea>
			{/* buttons in the bottom */}
			<div className="edit-comment-buttons">
				{/* Save Edited Content */}
				<ReadButton
					data-testid={`save-edit-${index}`}
					onClick={handleSaveUpdate}
					disabled={isLoading}
				>
					Save
				</ReadButton>
				{/* Cancel Editing */}
				<ReadButton onClick={resetCommentState}>Cancel</ReadButton>
			</div>
		</>
	);
};

export default EditComment;
