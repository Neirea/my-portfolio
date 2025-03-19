import type { JSX } from "react";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import { useGlobalContext } from "../../../../store/AppContext";
import { AlertMsg } from "../../../../styles/common.style";
import type { CommentJsx } from "../../../../types/article.type";
import { handleDate } from "../../../../utils/handleDate";
import CommentForm from "./CommentForm";
import { SingleCommentContainer } from "./Comments.style";
import ToolBar from "./CommentToolBar";
import EditComment from "./EditComment";

type SingleCommentProps = {
    index: number;
    commentElement: CommentJsx;
};

const SingleComment = ({
    index,
    commentElement,
}: SingleCommentProps): JSX.Element => {
    const { user } = useGlobalContext();

    const { level, comment, parentComment } = commentElement;
    const margin = 3;
    const depth = level >= 5 ? 5 : level;
    const { commentState, commentError } = useCommentsContext();

    const isShowToolBar =
        commentState.type !== "edit" && user && user.isBanned === false;

    const isShowMessage =
        commentState.type !== "edit" || commentState.id !== comment._id;

    const isShowSingleCommentAlert =
        commentError.msg && index === commentError.index;

    const isShowEditUI =
        user && commentState.type === "edit" && commentState.id === comment._id;

    const isShowReplyForm =
        user &&
        user.isBanned === false &&
        commentState.type === "reply" &&
        commentState.id === comment._id;

    const isShowParentComment = level > 5 && parentComment;

    const truncateText = (text: string, limit: number): string => {
        return text.length > limit ? text.slice(0, limit) + "..." : text;
    };

    return (
        <>
            <SingleCommentContainer $margin={margin} $depth={depth}>
                {isShowParentComment && (
                    <div className="comment-header">
                        <span
                            className="comment-header-reply"
                            title={parentComment.user.name}
                        >{`to: "${truncateText(
                            parentComment.message,
                            20,
                        )}" by:`}</span>
                        <img
                            className="comment-img"
                            src={parentComment.user.avatar}
                            width={20}
                            height={20}
                            alt="user avatar"
                            referrerPolicy="no-referrer"
                        />
                        <span className="comment-author comment-header-reply">
                            {parentComment.user.name}
                        </span>
                    </div>
                )}
                <div className="comment-header">
                    <img
                        className="comment-img"
                        src={comment.user.avatar}
                        width={24}
                        height={24}
                        alt="user avatar"
                        referrerPolicy="no-referrer"
                    />
                    <span className="comment-author">{comment.user.name}</span>
                    <span className="comment-date">
                        {handleDate(comment.createdAt, comment.editedAt)}
                    </span>
                </div>
                {isShowMessage && (
                    <p className="comment-message">
                        {comment.message || <i>Message was deleted</i>}
                    </p>
                )}
                {isShowSingleCommentAlert && (
                    <AlertMsg>{commentError.msg}</AlertMsg>
                )}
                {isShowEditUI && (
                    <EditComment index={index} comment={comment} />
                )}
                {isShowToolBar && <ToolBar index={index} comment={comment} />}
            </SingleCommentContainer>
            {isShowReplyForm && (
                <CommentForm
                    comment={comment}
                    index={index}
                    margin={margin}
                    depth={depth}
                />
            )}
        </>
    );
};

export default SingleComment;
