import { ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useArticleContext } from "../../../../store/SingleArticleContext";
import { ReadButton } from "../../../../styles/StyledComponents";
import { handleError } from "../../../../utils/handleError";
import { ACTIONS, IComment } from "../../../../types/articleTypes";

interface EditCommentProps {
	index: number;
	comment: IComment;
	handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditComment = ({ index, comment, handleChange }: EditCommentProps) => {
	const navigate = useNavigate();
	const {
		hideAlert,
		showAlert,
		setLoading,
		articleId,
		comments,
		setComments,
		commentState,
		setCommentState,
	} = useArticleContext();

	const handleSaveUpdate = async () => {
		hideAlert();
		setLoading(true);

		try {
			const { data } = await axios.patch(
				`api/v1/comment/${articleId}/${comment._id}`,
				{ message: commentState.message }
			);
			const items = comments;
			items[index].comment = data.comment;
			setComments(items);
			setCommentState({
				type: ACTIONS.none,
				id: null,
				message: "",
			});
		} catch (error) {
			handleError(error, navigate);
			showAlert({
				text: error?.response?.data?.msg || "There was an error!",
				type: index.toString(),
			});
		} finally {
			setLoading(false);
		}
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
				>
					Save
				</ReadButton>
				{/* Cancel Editing */}
				<ReadButton
					onClick={() => {
						setCommentState({
							type: ACTIONS.none,
							id: null,
							message: "",
						});
					}}
				>
					Cancel
				</ReadButton>
			</div>
		</>
	);
};

export default EditComment;
