import { MdDelete, MdOutlineAccountTree } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { FaBan, FaWrench } from "react-icons/fa";
import { ToolsButton } from "./CommentStyles";
import axios from "axios";
import {
	useArticleContext,
	parseComments,
} from "../../../../store/SingleArticleContext";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../../utils/handleError";
import { useGlobalContext } from "../../../../store/AppContext";
import { ACTIONS, IComment, IJsxComment } from "../../../../types/articleTypes";
import { userRoles } from "../../../../types/appTypes";

const ToolBar = ({ index, comment }: { index: number; comment: IComment }) => {
	const { user } = useGlobalContext();
	const navigate = useNavigate();
	const {
		comments,
		setComments,
		articleId,
		commentState,
		setCommentState,
		hideAlert,
		showAlert,
		loading,
		setLoading,
	} = useArticleContext();

	const isShowBanMenu = user?._id !== comment.user.id;

	const updateCommentsAfterDelete = () => {
		const items = comments;
		if (items[index].comment.replies.length === 0) {
			//if comment has parent then delete this comment from parent's replies

			const parentId = items[index].comment.parentId;

			if (parentId) {
				const parentIndex = items.findIndex(
					(element) => element.comment._id === parentId
				);
				//get index to remove comment from parent's replies
				const deleteIndex = items[parentIndex].comment.replies.indexOf(
					items[index].comment
				);
				items[parentIndex].comment.replies.splice(deleteIndex, 1);
			}
			//delete comment with index
			items.splice(index, 1);
		} else {
			items[index].comment.message = "";
		}
		return items;
	};

	const resetCommentState = (commentId: number) => {
		commentState.id === commentId &&
			setCommentState({
				type: ACTIONS.none,
				id: null,
				message: "",
			});
	};

	//operations on messages
	const deleteMessage = async () => {
		hideAlert();
		setLoading(true);
		resetCommentState(comment._id);

		try {
			await axios.delete(`api/comment/${articleId}/${comment._id}`);

			const newComments = updateCommentsAfterDelete();
			setComments(newComments);
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
	const deleteCommentTree = async () => {
		hideAlert();
		setLoading(true);
		resetCommentState(comment._id);

		try {
			await axios.delete(`api/comment/${articleId}/d_all/${comment._id}`);
			//additional request to update comments
			const commentsArray: IJsxComment[] = [];
			await axios
				.get<{ comments: IComment[] }>(`api/comment/${articleId}`)
				.then((res) => {
					parseComments(res.data.comments, -1, commentsArray);
				});
			setComments(commentsArray);
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

	const handleBan = async () => {
		hideAlert();
		setLoading(true);

		try {
			await axios.delete(`api/user/${comment.user.id}`);
			//additional request to update comments
			const commentsArray: IJsxComment[] = [];
			await axios
				.get<{ comments: IComment[] }>(`api/comment/${articleId}`)
				.then((res) => {
					parseComments(res.data.comments, -1, commentsArray);
				});
			setComments(commentsArray);
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

	const handleEditCommentClick = () => {
		setCommentState({
			type: ACTIONS.edit,
			id: comment._id,
			message: comment.message,
		});
	};

	return (
		<div className="tool-bar">
			<ToolsButton
				data-testid={`edit-${index}`}
				title={"Edit Comment"}
				onClick={handleEditCommentClick}
			>
				<AiFillEdit size={"100%"} />
			</ToolsButton>
			{comment.message && (
				<ToolsButton
					data-testid={`delete-${index}`}
					title="Delete Comment"
					onClick={deleteMessage}
				>
					<MdDelete size={"100%"} />
				</ToolsButton>
			)}
			{user?.roles.includes(userRoles.admin) && (
				<>
					<ToolsButton
						data-testid={`delete-tree-${index}`}
						title="Delete Comment Tree"
						onClick={deleteCommentTree}
					>
						<MdOutlineAccountTree size={"100%"} />
					</ToolsButton>
					{isShowBanMenu && (
						<ToolsButton
							title="Ban User"
							disabled={loading}
							onClick={handleBan}
						>
							{comment.user.isBanned ? (
								<FaWrench size={"100%"} />
							) : (
								<FaBan size={"100%"} />
							)}
						</ToolsButton>
					)}
				</>
			)}
		</div>
	);
};

export default ToolBar;
