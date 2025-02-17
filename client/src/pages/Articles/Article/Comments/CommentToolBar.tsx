import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiOutlineDeleteColumn } from "@react-icons/all-files/ai/AiOutlineDeleteColumn";
import { BsReplyFill } from "@react-icons/all-files/bs/BsReplyFill";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import type { MouseEvent } from "react";
import useComments from "../../../../hooks/Articles/comments/useComments";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import useDeleteComment from "../../../../hooks/Articles/comments/useDeleteComment";
import useDeleteCommentCascade from "../../../../hooks/Articles/comments/useDeleteCommentCascade";
import { useGlobalContext } from "../../../../store/AppContext";
import type { Comment } from "../../../../types/article.type";
import { ReplyButton, ToolsButton } from "./Comments.styles";
import { hasPermission } from "../../../../utils/abac";

const ToolBar = ({ index, comment }: { index: number; comment: Comment }) => {
    const { user } = useGlobalContext();

    const { articleId, setCommentState, commentState, resetCommentState } =
        useCommentsContext();
    const { isFetching } = useComments(articleId);
    const { mutate: deleteOneComment, isLoading: deleteOneLoading } =
        useDeleteComment();

    const { mutate: deleteCascade, isLoading: deleteCascadeLoading } =
        useDeleteCommentCascade();

    const isLoading = deleteOneLoading || deleteCascadeLoading || isFetching;

    const isShowReplyButton = commentState.type !== "edit" && comment.message;

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
                {hasPermission(user, "comments", "update", comment) && (
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
                {(comment.replies.length === 0 || comment.message) &&
                    hasPermission(user, "comments", "delete", comment) && (
                        <ToolsButton
                            aria-label={`delete #${index} comment`}
                            title="Delete Comment"
                            disabled={isLoading}
                            onClick={() =>
                                deleteOneComment({
                                    commentId: comment._id,
                                    index,
                                })
                            }
                        >
                            <MdDelete size={"100%"} />
                        </ToolsButton>
                    )}
                {hasPermission(user, "comments", "deleteCascade", comment) && (
                    <>
                        <ToolsButton
                            aria-label={`cascade delete of #${index} comment`}
                            title="Cascade Delete"
                            disabled={isLoading}
                            onClick={() =>
                                deleteCascade({
                                    commentId: comment._id,
                                    index,
                                })
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
