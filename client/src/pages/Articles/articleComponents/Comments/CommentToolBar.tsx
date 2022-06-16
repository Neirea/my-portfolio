import { MouseEvent } from "react";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import { AiOutlineDeleteColumn } from "@react-icons/all-files/ai/AiOutlineDeleteColumn";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { FaWrench } from "@react-icons/all-files/fa/FaWrench";
import { FaBan } from "@react-icons/all-files/fa/FaBan";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { BsReplyFill } from "@react-icons/all-files/bs/BsReplyFill";
import { ToolsButton, ReplyButton } from "./CommentStyles";
import { useGlobalContext } from "../../../../store/AppContext";
import { ACTIONS, IComment } from "../../../../types/articleTypes";
import { userRoles } from "../../../../types/appTypes";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useDeleteComment from "../../../../hooks/Articles/comments/useDeleteComment";
import useDeleteCommentTree from "../../../../hooks/Articles/comments/useDeleteCommentTree";
import useBanUser from "../../../../hooks/useBanUser";

const ToolBar = ({ index, comment }: { index: number; comment: IComment }) => {
	const { user } = useGlobalContext();
	const { commentsQuery, setCommentState, commentState, resetCommentState } =
		useCommentsContext();
	const { mutate: deleteOneComment, isLoading: deleteOneLoading } =
		useDeleteComment();

	const { mutate: deleteCommentTree, isLoading: deleteTreeLoading } =
		useDeleteCommentTree();
	const { mutate: banUser, isLoading: banUserLoading } = useBanUser();

	const isLoading =
		deleteOneLoading || deleteTreeLoading || commentsQuery.isFetching;
	const isShowBanMenu = user?._id !== comment.user.id;

	console.log(isLoading);

	const isShowReplyButton =
		commentState.type !== ACTIONS.edit && comment.message;

	const handleEditCommentClick = () => {
		resetCommentState();
		setCommentState({
			type: ACTIONS.edit,
			id: comment._id,
			message: comment.message,
		});
	};

	const handleReply = (e: MouseEvent<HTMLButtonElement>) => {
		//remove existing active style
		const element = document.querySelector(".btn-activated");
		element && element.classList.remove("btn-activated");
		//on Cancel click
		if (commentState.id === comment._id) {
			resetCommentState();
		} else {
			e.currentTarget.classList.add("btn-activated");
			setCommentState({
				type: ACTIONS.reply,
				id: comment._id,
				message: "",
			});
		}
	};

	return (
		<div className="tool-bar">
			<div className="tool-bar-group">
				{isShowReplyButton && (
					<ReplyButton
						data-testid={`reply-button-${index}`}
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
							title="Delete Comment Tree"
							disabled={isLoading}
							onClick={() =>
								deleteCommentTree({ commentId: comment._id, index })
							}
						>
							<AiOutlineDeleteColumn size={"100%"} />
						</ToolsButton>
						{isShowBanMenu && (
							<ToolsButton
								title="Ban User"
								disabled={banUserLoading}
								onClick={() => banUser(comment.user.id)}
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
		</div>
	);
};

export default ToolBar;
