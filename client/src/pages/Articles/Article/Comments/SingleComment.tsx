import { FaArrowUp } from "@react-icons/all-files/fa/FaArrowUp";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import { useGlobalContext } from "../../../../store/AppContext";
import { AlertMsg } from "../../../../styles/styled-components";
import type { IJsxComment } from "../../../../types/article.type";
import { handleDate } from "../../../../utils/handleDate";
import CommentForm from "./CommentForm";
import { SingleCommentContainer } from "./Comments.styles";
import ToolBar from "./CommentToolBar";
import EditComment from "./EditComment";

interface SingleCommentProps {
    index: number;
    commentElement: IJsxComment;
}

const SingleComment = ({ index, commentElement }: SingleCommentProps) => {
    const { user } = useGlobalContext();

    const { level, comment } = commentElement;
    const step = 3; // % of marginLeft and cut on width
    const depth = level >= 5 ? 5 : level; //max depth to show
    const { commentState, commentError } = useCommentsContext();

    /* show conditions */
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

    return (
        <>
            {/* {isShowSingleCommentAlert && <AlertMsg>{commentError.msg}</AlertMsg>} */}
            <SingleCommentContainer step={step} depth={depth}>
                {/* Comment Header */}
                <div className="comment-header">
                    {level > 5 && (
                        <>
                            <FaArrowUp />
                            <span>{"from:"}</span>
                        </>
                    )}
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
                {/* Message */}
                {isShowMessage && (
                    <p className="comment-message">
                        {comment.message || <i>Message was deleted</i>}
                    </p>
                )}
                {/* Single Comment Errors */}
                {isShowSingleCommentAlert && (
                    <AlertMsg>{commentError.msg}</AlertMsg>
                )}
                {/* Edit Comment Form && Buttons */}
                {isShowEditUI && (
                    <EditComment index={index} comment={comment} />
                )}
                {/* Toolbar for comment */}
                {isShowToolBar && <ToolBar index={index} comment={comment} />}
            </SingleCommentContainer>
            {/* Reply Form */}
            {isShowReplyForm && (
                <CommentForm
                    comment={comment}
                    index={index}
                    step={step}
                    depth={depth}
                />
            )}
        </>
    );
};

export default SingleComment;
