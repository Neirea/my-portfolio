import { Fragment, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AlertMsg } from "../../../../styles/styled-components";
import CommentForm from "./CommentForm";
import { CommentsWrapper } from "./Comments.styles";
import SingleComment from "./SingleComment";
import useComments from "../../../../hooks/Articles/comments/useComments";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import { useGlobalContext } from "../../../../store/AppContext";
import autoAnimate from "@formkit/auto-animate";

const Comments = () => {
    const location = useLocation();
    const { user } = useGlobalContext();
    const commentsWrapperRef = useRef<HTMLElement>(null);
    const { articleId, commentState, commentError } = useCommentsContext();
    const { data: comments } = useComments(articleId);

    const isShowCommentsHeader = !!comments?.length || user;
    const isShowCommentError =
        commentError.msg && commentError.index === undefined;
    const isShowNewCommentForm =
        user && user.isBanned === false && commentState.type === "none";

    useEffect(() => {
        commentsWrapperRef.current && autoAnimate(commentsWrapperRef.current);
    }, [parent]);

    return (
        <CommentsWrapper ref={commentsWrapperRef}>
            <>
                {/* Comments Header */}
                {isShowCommentsHeader && (
                    <h4 className="comments-section-header">
                        {comments
                            ? `Comments(${comments.length}):`
                            : "Loading comments..."}
                    </h4>
                )}
                {user && user.isBanned && (
                    <AlertMsg>
                        You are currently suspended from posting comments
                    </AlertMsg>
                )}
                {/* mapping through comments */}
                {comments?.map((element, index) => {
                    return (
                        <Fragment key={index}>
                            <SingleComment
                                index={index}
                                commentElement={element}
                            />
                        </Fragment>
                    );
                })}
            </>
            {
                /* alert for "Create New Comment" */
                isShowCommentError && <AlertMsg>{commentError.msg}</AlertMsg>
            }
            {/*show "Create New Comment" only if "Reply Form" and "Edit Message" are disabled */}
            {isShowNewCommentForm && <CommentForm />}
            {!user && (
                <>
                    <div className="notsigned-message">
                        <span>
                            <NavLink
                                to="/login"
                                style={{ color: "var(--button-color)" }}
                                state={{ from: location }}
                                replace
                            >
                                {"Sign in "}
                            </NavLink>
                        </span>
                        <span>{"to post a comment"}</span>
                    </div>
                </>
            )}
        </CommentsWrapper>
    );
};

export default Comments;
