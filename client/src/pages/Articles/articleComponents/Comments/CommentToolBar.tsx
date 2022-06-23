import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiOutlineDeleteColumn } from "@react-icons/all-files/ai/AiOutlineDeleteColumn";
import { BsReplyFill } from "@react-icons/all-files/bs/BsReplyFill";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import type { MouseEvent } from "react";
import useComments from "../../../../hooks/Articles/comments/useComments";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useDeleteComment from "../../../../hooks/Articles/comments/useDeleteComment";
import useDeleteCommentTree from "../../../../hooks/Articles/comments/useDeleteCommentTree";
import { useGlobalContext } from "../../../../store/AppContext";
import { userRoles } from "../../../../types/appTypes";
import type { IComment } from "../../../../types/articleTypes";
import { ReplyButton, ToolsButton } from "./CommentStyles";

const ToolBar = ({ index, comment }: { index: number; comment: IComment }) => {
	const { user } = useGlobalContext();

	const { articleId, setCommentState, commentState, resetCommentState } =
		useCommentsContext();
	const { isFetching } = useComments(articleId);
	const { mutate: deleteOneComment, isLoading: deleteOneLoading } =
		useDeleteComment();

	const { mutate: deleteCommentTree, isLoading: deleteTreeLoading } =
		useDeleteCommentTree();

	const isLoading = deleteOneLoading || deleteTreeLoading || isFetching;

	const isShowReplyButton = commentState.type !== "edit" && comment.message;

	const isShowUserTools =
		user &&
		(user._id === comment.user.id || user.roles.includes(userRoles.admin));
	const isShowAdminTools = user && user.roles.includes(userRoles.admin);

	const isActiveReply =
		commentState.type === "reply" && comment._id === commentState.id;

	const handleEditCommentClick = () => {
		resetCommentState();
		setCommentState({
			type: "edit",
			id: comment._id,
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
		});
	};

	return (
		<div className="tool-bar">
			<div className="tool-bar-group">
				{isShowReplyButton && (
					<ReplyButton
						className={isActiveReply ? "btn-activated" : ""}
						aria-label={`reply to #${index} comment`}
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
				{isShowUserTools && (
					<ToolsButton
						aria-label={`edit #${index} comment`}
						title={"Edit Comment"}
						onClick={handleEditCommentClick}
						disabled={isLoading}
					>
						<AiFillEdit size={"100%"} />
					</ToolsButton>
				)}
			</div>
			<div className="tool-bar-group">
				{comment.message && isShowUserTools && (
					<ToolsButton
						aria-label={`delete #${index} comment`}
						title="Delete Comment"
						disabled={isLoading}
						onClick={() => deleteOneComment({ commentId: comment._id, index })}
					>
						<MdDelete size={"100%"} />
					</ToolsButton>
				)}
				{isShowAdminTools && (
					<>
						<ToolsButton
							aria-label={`delete tree of #${index} comment`}
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
