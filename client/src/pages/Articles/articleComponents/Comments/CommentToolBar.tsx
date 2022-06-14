import { MdDelete, MdOutlineAccountTree } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { FaBan, FaWrench } from "react-icons/fa";
import { ToolsButton } from "./CommentStyles";
import { useGlobalContext } from "../../../../store/AppContext";
import { ACTIONS, IComment } from "../../../../types/articleTypes";
import { userRoles } from "../../../../types/appTypes";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useDeleteComment from "../../../../hooks/Articles/comments/useDeleteComment";
import useDeleteCommentTree from "../../../../hooks/Articles/comments/useDeleteCommentTree";
import useBanUser from "../../../../hooks/useBanUser";

const ToolBar = ({ index, comment }: { index: number; comment: IComment }) => {
	const { user } = useGlobalContext();
	const { setCommentState } = useCommentsContext();
	const { mutate: deleteOneComment, isLoading: deleteOneLoading } =
		useDeleteComment(index);

	const { mutate: deleteCommentTree, isLoading: deleteTreeLoading } =
		useDeleteCommentTree(index);
	const { mutate: banUser, isLoading: banUserLoading } = useBanUser();

	const isShowBanMenu = user?._id !== comment.user.id;

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
					disabled={deleteOneLoading}
					onClick={() => deleteOneComment(comment._id)}
				>
					<MdDelete size={"100%"} />
				</ToolsButton>
			)}
			{user?.roles.includes(userRoles.admin) && (
				<>
					<ToolsButton
						data-testid={`delete-tree-${index}`}
						title="Delete Comment Tree"
						disabled={deleteTreeLoading}
						onClick={() => deleteCommentTree(comment._id)}
					>
						<MdOutlineAccountTree size={"100%"} />
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
	);
};

export default ToolBar;
