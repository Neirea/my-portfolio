import { MouseEvent } from "react";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import { AiOutlineDeleteColumn } from "@react-icons/all-files/ai/AiOutlineDeleteColumn";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { BsReplyFill } from "@react-icons/all-files/bs/BsReplyFill";
import { ToolsButton, ReplyButton } from "./CommentStyles";
import { useGlobalContext } from "../../../../store/AppContext";
import { IComment } from "../../../../types/articleTypes";
import { userRoles } from "../../../../types/appTypes";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useDeleteComment from "../../../../hooks/Articles/comments/useDeleteComment";
import useDeleteCommentTree from "../../../../hooks/Articles/comments/useDeleteCommentTree";

const ToolBar = ({ index, comment }: { index: number; comment: IComment }) => {
	const { user } = useGlobalContext();
	const { commentsQuery, setCommentState, commentState, resetCommentState } =
		useCommentsContext();
	const { mutate: deleteOneComment, isLoading: deleteOneLoading } =
		useDeleteComment();

	const { mutate: deleteCommentTree, isLoading: deleteTreeLoading } =
		useDeleteCommentTree();

	const isLoading =
		deleteOneLoading || deleteTreeLoading || commentsQuery.isFetching;

	const isShowReplyButton = commentState.type !== "edit" && comment.message;

	const isActiveReply =
		commentState.type === "reply" && comment._id === commentState.id;

	const handleEditCommentClick = () => {
		resetCommentState();
		setCommentState({
			type: "edit",
			id: comment._id,
			message: comment.message,
		});
	};

	const handleReply = (e: MouseEvent<HTMLButtonElement>) => {
		//on Cancel click
		if (commentState.id === comment._id) {
			resetCommentState();
			return;
		}
		setCommentState({
			type: "reply",
			id: comment._id,
			message: "",
		});
	};

	return (
		<div className="tool-bar">
			<div className="tool-bar-group">
				{isShowReplyButton && (
					<ReplyButton
						className={isActiveReply ? "btn-activated" : ""}
						data-testid={`reply-button-${index}`}
						aria-label="reply to comment"
						onClick={handleReply}
						disabled={isLoading}
					>
						{commentState.id === comment._id ? (
							<MdClose size={"100%"} />
						) : (
							<BsReplyFill size={"100%"} />
						)}
					</ReplyButton>
				)}
				<ToolsButton
					data-testid={`edit-${index}`}
					aria-label="edit comment"
					title={"Edit Comment"}
					onClick={handleEditCommentClick}
					disabled={isLoading}
				>
					<AiFillEdit size={"100%"} />
				</ToolsButton>
			</div>
			<div className="tool-bar-group">
				{comment.message && (
					<ToolsButton
						data-testid={`delete-${index}`}
						aria-label="delete comment"
						title="Delete Comment"
						disabled={isLoading}
						onClick={() => deleteOneComment({ commentId: comment._id, index })}
					>
						<MdDelete size={"100%"} />
					</ToolsButton>
				)}
				{user?.roles.includes(userRoles.admin) && (
					<>
						<ToolsButton
							data-testid={`delete-tree-${index}`}
							aria-label="delete comment tree"
							title="Delete Comment Tree"
							disabled={isLoading}
							onClick={() =>
								deleteCommentTree({ commentId: comment._id, index })
							}
						>
							<AiOutlineDeleteColumn size={"100%"} />
						</ToolsButton>
					</>
				)}
			</div>
		</div>
	);
};

export default ToolBar;
