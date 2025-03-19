import { Fragment, useRef, useEffect, type JSX } from "react";
import { NavLink, useLocation } from "react-router";
import { AlertMsg } from "../../../../styles/common.style";
import CommentForm from "./CommentForm";
import { CommentsWrapper } from "./Comments.style";
import SingleComment from "./SingleComment";
import useComments from "../../../../hooks/Articles/comments/useComments";
import useCommentsContext from "../../../../hooks/Articles/comments/useCommentsContext";
import { useGlobalContext } from "../../../../store/AppContext";
import autoAnimate from "@formkit/auto-animate";

const Comments = (): JSX.Element => {
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
        if (commentsWrapperRef.current) {
            autoAnimate(commentsWrapperRef.current);
        }
    }, [parent]);

    return (
        <CommentsWrapper ref={commentsWrapperRef}>
            <>
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
            {isShowCommentError && <AlertMsg>{commentError.msg}</AlertMsg>}
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
